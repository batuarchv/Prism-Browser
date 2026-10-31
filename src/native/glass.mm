#import <AppKit/AppKit.h>
#import <objc/runtime.h>
#include <node_api.h>
#include <string>
static const char associatedGlass=0;
static std::string str(napi_env e,napi_value v){size_t n=0;napi_get_value_string_utf8(e,v,nullptr,0,&n);std::string s(n+1,0);napi_get_value_string_utf8(e,v,s.data(),s.size(),&n);s.resize(n);return s;}
static napi_value Configure(napi_env env,napi_callback_info info){
  size_t argc=4;napi_value argv[4];napi_get_cb_info(env,info,&argc,argv,nullptr,nullptr);
  void* bytes=nullptr;size_t length=0;bool isBuffer=false;if(argc<4||napi_is_buffer(env,argv[0],&isBuffer)!=napi_ok||!isBuffer||napi_get_buffer_info(env,argv[0],&bytes,&length)!=napi_ok||length<sizeof(void*)){napi_throw_type_error(env,nullptr,"Expected a native window handle");return nullptr;}
  const std::string mode=str(env,argv[1]),tint=str(env,argv[2]);double radius=18;napi_get_value_double(env,argv[3],&radius);
  NSView* root=(__bridge NSView*)(*reinterpret_cast<void**>(bytes));__block NSString* result=@"Solid";
  void (^apply)(void)=^{
    NSView* current=objc_getAssociatedObject(root,&associatedGlass);
    bool wantsGlass=mode=="regular"||mode=="clear";
    if(mode=="solid"){[current removeFromSuperview];objc_setAssociatedObject(root,&associatedGlass,nil,OBJC_ASSOCIATION_RETAIN_NONATOMIC);return;}
    if(@available(macOS 26.0,*)){
      if(wantsGlass){
        NSGlassEffectView* glass;
        if([current isKindOfClass:[NSGlassEffectView class]])glass=(NSGlassEffectView*)current;
        else{[current removeFromSuperview];glass=[[NSGlassEffectView alloc] initWithFrame:root.bounds];glass.autoresizingMask=NSViewWidthSizable|NSViewHeightSizable;[root addSubview:glass positioned:NSWindowBelow relativeTo:nil];objc_setAssociatedObject(root,&associatedGlass,glass,OBJC_ASSOCIATION_RETAIN_NONATOMIC);}
        glass.style=mode=="clear"?NSGlassEffectViewStyleClear:NSGlassEffectViewStyleRegular;
        glass.cornerRadius=radius;unsigned rgb=0;NSString* hex=[NSString stringWithUTF8String:tint.c_str()];[[NSScanner scannerWithString:[hex stringByReplacingOccurrencesOfString:@"#" withString:@""]] scanHexInt:&rgb];
        glass.tintColor=[NSColor colorWithSRGBRed:((rgb>>16)&255)/255.0 green:((rgb>>8)&255)/255.0 blue:(rgb&255)/255.0 alpha:0.12];
        result=@"Native Liquid Glass";return;
      }
    }
    NSVisualEffectView* frost;
    if([current isKindOfClass:[NSVisualEffectView class]])frost=(NSVisualEffectView*)current;
    else{[current removeFromSuperview];frost=[[NSVisualEffectView alloc] initWithFrame:root.bounds];frost.autoresizingMask=NSViewWidthSizable|NSViewHeightSizable;[root addSubview:frost positioned:NSWindowBelow relativeTo:nil];objc_setAssociatedObject(root,&associatedGlass,frost,OBJC_ASSOCIATION_RETAIN_NONATOMIC);}
    frost.material=NSVisualEffectMaterialSidebar;frost.blendingMode=NSVisualEffectBlendingModeBehindWindow;frost.state=NSVisualEffectStateFollowsWindowActiveState;frost.wantsLayer=YES;frost.layer.cornerRadius=radius;frost.layer.masksToBounds=YES;result=@"Native frosted glass";
  };
  if([NSThread isMainThread])apply();else dispatch_sync(dispatch_get_main_queue(),apply);
  napi_value value;napi_create_string_utf8(env,result.UTF8String,NAPI_AUTO_LENGTH,&value);return value;
}

// Popover panels (0.43): the child window that holds Settings, site controls and the other popovers never becomes the
// main window, so the browser window keeps its active title bar while you type in a popover, as with NSPopover.
static napi_value Popover(napi_env env,napi_callback_info info){
  size_t argc=1;napi_value argv[1];napi_get_cb_info(env,info,&argc,argv,nullptr,nullptr);void* bytes=nullptr;size_t length=0;bool isBuffer=false;
  if(argc<1||napi_is_buffer(env,argv[0],&isBuffer)!=napi_ok||!isBuffer||napi_get_buffer_info(env,argv[0],&bytes,&length)!=napi_ok||length<sizeof(void*)){napi_throw_type_error(env,nullptr,"Expected a native window handle");return nullptr;}
  NSView* root=(__bridge NSView*)(*reinterpret_cast<void**>(bytes));__block NSString* result=@"none";
  // Electron uses ElectronNSPanel only for type:'panel' windows, so changing that class touches no other window.
  void (^apply)(void)=^{
    NSWindow* window=root.window;if(!window)return;
    // Key-value observing puts a generated subclass in front of the real one; the method goes on the real class.
    Class cls=object_getClass(window);while(cls&&[NSStringFromClass(cls) hasPrefix:@"NSKVONotifying_"])cls=class_getSuperclass(cls);
    if(!cls)return;result=NSStringFromClass(cls);if(![result isEqualToString:@"ElectronNSPanel"])return;
    class_replaceMethod(cls,@selector(canBecomeMainWindow),imp_implementationWithBlock(^BOOL(id self){return NO;}),"c@:");
    result=[result stringByAppendingString:@" (never main)"];
  };
  if([NSThread isMainThread])apply();else dispatch_sync(dispatch_get_main_queue(),apply);
  napi_value value;napi_create_string_utf8(env,result.UTF8String,NAPI_AUTO_LENGTH,&value);return value;
}
// Force click (0.47): a deep press on the trackpad over a link opens it in Lens, as Safari's link previews do. JavaScript
// arms the hook while the pointer is over a link (Chromium reports the link through update-target-url); a deep press
// then gives a light haptic tap, is kept from Chromium (so no Look Up panel appears) and is reported to JavaScript.
// Anywhere else force click behaves as usual.
static id forceMonitor=nil;static bool forceArmed=false,forceFired=false;static napi_threadsafe_function forceCallback=nullptr;static __weak NSWindow* forceWindow=nil;
static void CallForce(napi_env env,napi_value js,void*,void*){if(env&&js){napi_value undefined;napi_get_undefined(env,&undefined);napi_call_function(env,undefined,js,0,nullptr,nullptr);}}
static napi_value ForceClick(napi_env env,napi_callback_info info){
  size_t argc=2;napi_value argv[2];napi_get_cb_info(env,info,&argc,argv,nullptr,nullptr);
  void* bytes=nullptr;size_t length=0;bool isBuffer=false;if(argc<2||napi_is_buffer(env,argv[0],&isBuffer)!=napi_ok||!isBuffer||napi_get_buffer_info(env,argv[0],&bytes,&length)!=napi_ok||length<sizeof(void*)){napi_throw_type_error(env,nullptr,"Expected a native window handle and a callback");return nullptr;}
  NSView* root=(__bridge NSView*)(*reinterpret_cast<void**>(bytes));forceWindow=root.window;
  if(forceCallback){napi_release_threadsafe_function(forceCallback,napi_tsfn_abort);forceCallback=nullptr;}
  napi_value name;napi_create_string_utf8(env,"prism-force-click",NAPI_AUTO_LENGTH,&name);
  napi_create_threadsafe_function(env,argv[1],nullptr,name,0,1,nullptr,nullptr,nullptr,CallForce,&forceCallback);napi_unref_threadsafe_function(env,forceCallback);
  if(!forceMonitor)forceMonitor=[NSEvent addLocalMonitorForEventsMatchingMask:(NSEventMaskPressure|NSEventMaskFromType(NSEventTypeQuickLook)) handler:^NSEvent*(NSEvent* event){
    if(event.window!=forceWindow)return event;
    if(event.type==NSEventTypeQuickLook)return forceArmed?nil:event;
    if(event.stage<2){forceFired=false;return event;}
    if(!forceArmed)return event;if(forceFired)return nil;forceFired=true;
    [[NSHapticFeedbackManager defaultPerformer] performFeedbackPattern:NSHapticFeedbackPatternGeneric performanceTime:NSHapticFeedbackPerformanceTimeNow];
    if(forceCallback)napi_call_threadsafe_function(forceCallback,nullptr,napi_tsfn_nonblocking);return nil;}];
  return nullptr;}
static napi_value ArmForceClick(napi_env env,napi_callback_info info){size_t argc=1;napi_value argv[1];napi_get_cb_info(env,info,&argc,argv,nullptr,nullptr);bool on=false;if(argc>0)napi_get_value_bool(env,argv[0],&on);forceArmed=on;return nullptr;}
static napi_value Init(napi_env env,napi_value exports){napi_value fn;napi_create_function(env,"configure",NAPI_AUTO_LENGTH,Configure,nullptr,&fn);napi_set_named_property(env,exports,"configure",fn);napi_value popover;napi_create_function(env,"popover",NAPI_AUTO_LENGTH,Popover,nullptr,&popover);napi_set_named_property(env,exports,"popover",popover);napi_value force;napi_create_function(env,"forceClick",NAPI_AUTO_LENGTH,ForceClick,nullptr,&force);napi_set_named_property(env,exports,"forceClick",force);napi_value arm;napi_create_function(env,"armForceClick",NAPI_AUTO_LENGTH,ArmForceClick,nullptr,&arm);napi_set_named_property(env,exports,"armForceClick",arm);return exports;}
NAPI_MODULE(NODE_GYP_MODULE_NAME,Init)

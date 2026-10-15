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
static napi_value Init(napi_env env,napi_value exports){napi_value fn;napi_create_function(env,"configure",NAPI_AUTO_LENGTH,Configure,nullptr,&fn);napi_set_named_property(env,exports,"configure",fn);return exports;}
NAPI_MODULE(NODE_GYP_MODULE_NAME,Init)

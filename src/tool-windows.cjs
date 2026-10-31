const path=require('node:path'),{pathToFileURL}=require('node:url');
const {createStateTransport}=require('./performance.cjs');
// One reusable browser-owned surface. Native web pages remain visible underneath.
// Settings grows with large or full-screen windows (up to 1100×800) and never exceeds the window's margins.
// A compact popover right-aligned under its toolbar icon, kept inside the window.
function anchoredBelow(anchor,width,height,w,h){return {x:Math.max(8,Math.min(w-width-8,Math.round(anchor.x-width))),y:Math.max(44,Math.min(h-height-8,Math.round(anchor.y+6)))};}
function panelSize(w,h){return {width:Math.min(1100,Math.max(780,Math.round(w*0.72)),w-32),height:Math.min(800,Math.max(620,Math.round(h*0.8)),h-76)};}
// The surface stays loaded for a short while after it closes, and is loaded ahead of time when the pointer reaches a
// button that opens it, so popovers appear at once instead of waiting for a fresh renderer. Closed, it is hidden and
// its renderer ends 20 s later (0.40; was 90 s), so nothing stays alive at idle.
const KEEP_WARM_MS=20*1000;
// With BrowserWindow (macOS, 0.43) the surface lives in a borderless child panel over the window, so native glass can sit
// behind it (onHost gets each new panel); without it the surface is a view in the window itself.
function createToolWindows({WebContentsView,BrowserWindow=null,parent,snapshot,onClosed=()=>{},keepWarmMs=KEEP_WARM_MS,decorate=()=>{},onHost=()=>{}}){
 let record=null,idle,sequence=0,lastHide=null;
 function publish(){if(record?.ready&&!record.view.webContents.isDestroyed())record.view.webContents.send('state',record.transport.prepare({...snapshot(),images:{},imageRevision:'panel',bookmarks:[],folders:[]}));}
 // Bounds are in the window's content coordinates; a child panel is placed at the same spot on screen.
 function put(bounds){if(!record.host){record.view.setBounds(bounds);return;}const c=parent().getContentBounds();record.view.setBounds({x:0,y:0,width:bounds.width,height:bounds.height});record.host.setBounds({x:c.x+bounds.x,y:c.y+bounds.y,width:bounds.width,height:bounds.height});}
 function layout(){if(!record?.visible)return;const [w,h]=parent().getContentSize(),compact=record.section.startsWith('quick-');const gmail=record.section==='quick-gmail',{width:settingsWidth,height:settingsHeight}=panelSize(w,h),width=compact?Math.min(344,w-32):settingsWidth,height=gmail?Math.min(310,h-76):record.section==='quick-extensions'?Math.min(220,h-76):compact?Math.min(430,h-76):settingsHeight;// Site controls open under the site icon at the left of the address bar, the spaces popover under the space switcher.
  if(['quick-site','quick-spaces'].includes(record.section)&&Number.isFinite(record.anchor?.left)){const sw=Math.min(record.section==='quick-spaces'?340:320,w-16),sh=Math.min(record.height||420,h-60);put({x:Math.max(8,Math.min(w-sw-8,Math.round(record.anchor.left-10))),y:Math.round(record.anchor.y+8),width:sw,height:sh});return;}
  const under=record.section==='quick-extensions'&&Number.isFinite(record.anchor?.x)?anchoredBelow({...record.anchor,x:Number.isFinite(record.anchor.fromRight)?w-record.anchor.fromRight:record.anchor.x},width,height,w,h):null;
  if(under){put({...under,width,height});return;}
  put({x:gmail?Math.max(8,Math.min(w-width-8,Math.round(Number(record.anchor?.x)||16))):compact?16:Math.round((w-width)/2),y:gmail?Math.max(48,Math.min(h-height-8,Math.round(Number(record.anchor?.y)||80))):compact?h-height-54:Math.max(50,Math.round((h-height)/2)),width,height});}
 function destroy(){clearTimeout(idle);if(record){if(record.host){if(!record.host.isDestroyed()){record.host.contentView.removeChildView(record.view);record.host.destroy();}}else if(parent()&&!parent().isDestroyed())parent().contentView.removeChildView(record.view);if(!record.view.webContents.isDestroyed())record.view.webContents.close();record=null;}}
 // A compact popover closes when focus moves elsewhere in the window (a click on the page or the sidebar). Native
 // pickers it opens take focus from the whole window, so those leave it open.
 function closeAll(reason){sequence++;if(!record)return;const wasVisible=record.visible,closed=record.section;if(wasVisible)lastHide={section:closed,reason,at:Date.now()};record.visible=false;record.view.setVisible(false);if(record.host&&!record.host.isDestroyed()){const had=record.host.isFocused();record.host.hide();
  // A hidden panel that had the keyboard hands it back to the browser window (0.44); macOS otherwise leaves Prism
  // with no key window, so shortcuts and the next click went nowhere.
  if(had&&reason!=='blur'&&reason!=='minimize'){const w=parent();if(w&&!w.isDestroyed()&&w.isVisible()&&!w.isMinimized())w.focus();}}record.view.webContents.send('gmail-preview',{messages:[]});record.view.webContents.send('panel-hidden');onClosed('settings',reason,closed,wasVisible);clearTimeout(idle);idle=setTimeout(destroy,keepWarmMs);idle.unref?.();}
 function create(section){const url=pathToFileURL(path.join(__dirname,'index.html'));url.searchParams.set('tool','panel');url.searchParams.set('section',section);const view=new WebContentsView({webPreferences:{preload:path.join(__dirname,'preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false}});view.setBorderRadius(16);view.setBackgroundColor('#00000000');view.setVisible(false);
  // An NSPanel never becomes the main window, so the browser window keeps its active look while the popover has focus.
  const host=BrowserWindow?new BrowserWindow({parent:parent(),show:false,frame:false,transparent:true,backgroundColor:'#00000000',hasShadow:true,resizable:false,movable:false,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,hiddenInMissionControl:true,roundedCorners:true,acceptFirstMouse:true,...(process.platform==='darwin'?{type:'panel'}:{})}):null;
  if(host){host.setAlwaysOnTop(false);host.contentView.addChildView(view);host.on('closed',()=>{if(record?.host===host)record.host=null;});onHost(host);}else parent().contentView.addChildView(view);
  record={view,host,url:url.href,ready:false,visible:false,section,transport:createStateTransport()};view.webContents.setWindowOpenHandler(()=>({action:'deny'}));view.webContents.on('will-navigate',e=>e.preventDefault());decorate(view.webContents);
  view.webContents.on('blur',()=>setTimeout(()=>{const r=record,w=parent();if(!r||r.view!==view||!r.visible||!r.section.startsWith('quick-')||r.section==='quick-gmail')return;if(!w||w.isDestroyed()||!w.isFocused()||view.webContents.isDestroyed()||view.webContents.isFocused())return;closeAll('blur');},0));
  record.loaded=require('./load-ready.cjs').whenUsable(view.webContents,()=>view.webContents.loadURL(url.href));}
 function prewarm(){if(record||!parent()||parent().isDestroyed())return;create('appearance');clearTimeout(idle);idle=setTimeout(destroy,keepWarmMs);idle.unref?.();}
 // The button that opened a popover closes it again; the click that just closed it (by taking focus) does not reopen it.
 function toggles(section){if(!section.startsWith('quick-')||section==='quick-gmail')return false;if(record?.visible&&record.section===section){closeAll('toggle');return true;}return !!(lastHide&&lastHide.section===section&&lastHide.reason==='blur'&&Date.now()-lastHide.at<300);}
 async function open(section='appearance',anchor){
  if(!/^[a-z-]+$/.test(section))return;if(toggles(section))return;lastHide=null;const gen=++sequence;clearTimeout(idle);
  if(!record)create(section);
  // The surface is placed and shown before its page has finished loading (0.34): under Electron 45 a hidden surface's
  // page can wait to finish until it is shown, so waiting first could leave Settings unopened. It is transparent until
  // the page draws, and the section is sent once the page is usable.
  const current=record;current.visible=true;current.section=section;current.anchor=anchor&&Number.isFinite(anchor.x)?{...anchor,fromRight:parent().getContentSize()[0]-anchor.x}:anchor;layout();if(current.host){if(parent().isMinimized())parent().restore();current.host.show();}else parent().contentView.addChildView(current.view);current.view.setVisible(true);
  await current.loaded;if(record!==current||gen!==sequence)return;current.ready=true;publish();layout();current.view.webContents.send('open-panel',section);if(section!=='quick-gmail')current.view.webContents.focus();
 }
 function trusted(event){return record&&event.sender===record.view.webContents&&event.senderFrame===record.view.webContents.mainFrame&&event.senderFrame.url===record.url?record:null;}
 return {open,prewarm,release(){if(!record?.visible)destroy();},publish,trusted,closeAll,destroy,layout,visible:()=>!!record?.visible,section:()=>record?.section,size(section){if(record){record.section=section;layout();}},fit(height){if(record&&Number.isFinite(height)){record.height=Math.max(160,Math.min(640,Math.round(height)));layout();}},get:()=>record?.view};
}
module.exports={createToolWindows,panelSize,anchoredBelow};

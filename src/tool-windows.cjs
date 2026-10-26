const path=require('node:path'),{pathToFileURL}=require('node:url');
const {createStateTransport}=require('./performance.cjs');
// One reusable browser-owned surface. Native web pages remain visible underneath.
// Settings grows with large or full-screen windows (up to 1100×800) and never exceeds the window's margins.
// A compact popover right-aligned under its toolbar icon, kept inside the window.
function anchoredBelow(anchor,width,height,w,h){return {x:Math.max(8,Math.min(w-width-8,Math.round(anchor.x-width))),y:Math.max(44,Math.min(h-height-8,Math.round(anchor.y+6)))};}
function panelSize(w,h){return {width:Math.min(1100,Math.max(780,Math.round(w*0.72)),w-32),height:Math.min(800,Math.max(620,Math.round(h*0.8)),h-76)};}
// The surface stays loaded (hidden) for a while after it closes, and is loaded ahead of time when the pointer reaches a
// button that opens it, so popovers appear at once instead of waiting for a fresh renderer.
const KEEP_WARM_MS=5*60*1000;
function createToolWindows({WebContentsView,parent,snapshot,onClosed=()=>{},keepWarmMs=KEEP_WARM_MS,decorate=()=>{}}){
 let record=null,idle,sequence=0,lastHide=null;
 function publish(){if(record?.ready&&!record.view.webContents.isDestroyed())record.view.webContents.send('state',record.transport.prepare({...snapshot(),images:{},imageRevision:'panel',bookmarks:[],folders:[]}));}
 function layout(){if(!record?.visible)return;const [w,h]=parent().getContentSize(),compact=record.section.startsWith('quick-');const gmail=record.section==='quick-gmail',{width:settingsWidth,height:settingsHeight}=panelSize(w,h),width=compact?Math.min(344,w-32):settingsWidth,height=gmail?Math.min(310,h-76):record.section==='quick-extensions'?Math.min(220,h-76):compact?Math.min(430,h-76):settingsHeight;// Site controls open under the site icon at the left of the address bar, the spaces popover under the space switcher.
  if(['quick-site','quick-spaces'].includes(record.section)&&Number.isFinite(record.anchor?.left)){const sw=Math.min(record.section==='quick-spaces'?340:320,w-16),sh=Math.min(record.height||420,h-60);record.view.setBounds({x:Math.max(8,Math.min(w-sw-8,Math.round(record.anchor.left-10))),y:Math.round(record.anchor.y+8),width:sw,height:sh});return;}
  const under=record.section==='quick-extensions'&&Number.isFinite(record.anchor?.x)?anchoredBelow({...record.anchor,x:Number.isFinite(record.anchor.fromRight)?w-record.anchor.fromRight:record.anchor.x},width,height,w,h):null;
  if(under){record.view.setBounds({...under,width,height});return;}
  record.view.setBounds({x:gmail?Math.max(8,Math.min(w-width-8,Math.round(Number(record.anchor?.x)||16))):compact?16:Math.round((w-width)/2),y:gmail?Math.max(48,Math.min(h-height-8,Math.round(Number(record.anchor?.y)||80))):compact?h-height-54:Math.max(50,Math.round((h-height)/2)),width,height});}
 function destroy(){clearTimeout(idle);if(record){if(parent()&&!parent().isDestroyed())parent().contentView.removeChildView(record.view);if(!record.view.webContents.isDestroyed())record.view.webContents.close();record=null;}}
 // A compact popover closes when focus moves elsewhere in the window (a click on the page or the sidebar). Native
 // pickers it opens take focus from the whole window, so those leave it open.
 function closeAll(reason){sequence++;if(!record)return;const wasVisible=record.visible,closed=record.section;if(wasVisible)lastHide={section:closed,reason,at:Date.now()};record.visible=false;record.view.setVisible(false);record.view.webContents.send('gmail-preview',{messages:[]});record.view.webContents.send('panel-hidden');onClosed('settings',reason,closed,wasVisible);clearTimeout(idle);idle=setTimeout(destroy,keepWarmMs);idle.unref?.();}
 function create(section){const url=pathToFileURL(path.join(__dirname,'index.html'));url.searchParams.set('tool','panel');url.searchParams.set('section',section);const view=new WebContentsView({webPreferences:{preload:path.join(__dirname,'preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false}});view.setBorderRadius(14);view.setBackgroundColor('#00000000');view.setVisible(false);parent().contentView.addChildView(view);record={view,url:url.href,ready:false,visible:false,section,transport:createStateTransport()};view.webContents.setWindowOpenHandler(()=>({action:'deny'}));view.webContents.on('will-navigate',e=>e.preventDefault());decorate(view.webContents);
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
  const current=record;current.visible=true;current.section=section;current.anchor=anchor&&Number.isFinite(anchor.x)?{...anchor,fromRight:parent().getContentSize()[0]-anchor.x}:anchor;layout();parent().contentView.addChildView(current.view);current.view.setVisible(true);
  await current.loaded;if(record!==current||gen!==sequence)return;current.ready=true;publish();layout();current.view.webContents.send('open-panel',section);if(section!=='quick-gmail')current.view.webContents.focus();
 }
 function trusted(event){return record&&event.sender===record.view.webContents&&event.senderFrame===record.view.webContents.mainFrame&&event.senderFrame.url===record.url?record:null;}
 return {open,prewarm,release(){if(!record?.visible)destroy();},publish,trusted,closeAll,destroy,layout,visible:()=>!!record?.visible,section:()=>record?.section,size(section){if(record){record.section=section;layout();}},fit(height){if(record&&Number.isFinite(height)){record.height=Math.max(160,Math.min(640,Math.round(height)));layout();}},get:()=>record?.view};
}
module.exports={createToolWindows,panelSize,anchoredBelow};

const path=require('node:path'),{pathToFileURL}=require('node:url');
const {createStateTransport}=require('./performance.cjs');
// One reusable browser-owned surface. Native web pages remain visible underneath.
// Settings grows with large or full-screen windows (up to 1100×800) and never exceeds the window's margins.
// A compact popover right-aligned under its toolbar icon, kept inside the window.
function anchoredBelow(anchor,width,height,w,h){return {x:Math.max(8,Math.min(w-width-8,Math.round(anchor.x-width))),y:Math.max(44,Math.min(h-height-8,Math.round(anchor.y+6)))};}
function panelSize(w,h){return {width:Math.min(1100,Math.max(780,Math.round(w*0.72)),w-32),height:Math.min(800,Math.max(620,Math.round(h*0.8)),h-76)};}
function createToolWindows({WebContentsView,parent,snapshot,onClosed=()=>{}}){
 let record=null,idle,sequence=0;
 function publish(){if(record?.ready&&!record.view.webContents.isDestroyed())record.view.webContents.send('state',record.transport.prepare({...snapshot(),images:{},imageRevision:'panel',bookmarks:[],folders:[]}));}
 function layout(){if(!record?.visible)return;const [w,h]=parent().getContentSize(),compact=record.section.startsWith('quick-');const gmail=record.section==='quick-gmail',{width:settingsWidth,height:settingsHeight}=panelSize(w,h),width=compact?Math.min(344,w-32):settingsWidth,height=gmail?Math.min(310,h-76):compact?Math.min(430,h-76):settingsHeight;const under=record.section==='quick-extensions'&&Number.isFinite(record.anchor?.x)?anchoredBelow({...record.anchor,x:Number.isFinite(record.anchor.fromRight)?w-record.anchor.fromRight:record.anchor.x},width,height,w,h):null;
  if(under){record.view.setBounds({...under,width,height});return;}
  record.view.setBounds({x:gmail?Math.max(8,Math.min(w-width-8,Math.round(Number(record.anchor?.x)||16))):compact?16:Math.round((w-width)/2),y:gmail?Math.max(48,Math.min(h-height-8,Math.round(Number(record.anchor?.y)||80))):compact?h-height-54:Math.max(50,Math.round((h-height)/2)),width,height});}
 function destroy(){clearTimeout(idle);if(record){if(parent()&&!parent().isDestroyed())parent().contentView.removeChildView(record.view);if(!record.view.webContents.isDestroyed())record.view.webContents.close();record=null;}}
 function closeAll(){sequence++;if(!record)return;record.visible=false;record.view.setVisible(false);record.view.webContents.send('gmail-preview',{messages:[]});record.view.webContents.send('panel-hidden');onClosed('settings');clearTimeout(idle);idle=setTimeout(destroy,3000);idle.unref?.();}
 async function open(section='appearance',anchor){
  if(!/^[a-z-]+$/.test(section))return;const gen=++sequence;clearTimeout(idle);
  if(!record){const url=pathToFileURL(path.join(__dirname,'index.html'));url.searchParams.set('tool','panel');url.searchParams.set('section',section);const view=new WebContentsView({webPreferences:{preload:path.join(__dirname,'preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false}});view.setBorderRadius(14);view.setBackgroundColor('#00000000');view.setVisible(false);parent().contentView.addChildView(view);record={view,url:url.href,ready:false,visible:false,section,transport:createStateTransport()};view.webContents.setWindowOpenHandler(()=>({action:'deny'}));view.webContents.on('will-navigate',e=>e.preventDefault());record.loaded=view.webContents.loadURL(url.href);}
  const current=record;await current.loaded;if(record!==current||gen!==sequence)return;current.ready=true;current.visible=true;current.section=section;current.anchor=anchor&&Number.isFinite(anchor.x)?{...anchor,fromRight:parent().getContentSize()[0]-anchor.x}:anchor;publish();layout();parent().contentView.addChildView(current.view);current.view.setVisible(true);current.view.webContents.send('open-panel',section);if(section!=='quick-gmail')current.view.webContents.focus();
 }
 function trusted(event){return record&&event.sender===record.view.webContents&&event.senderFrame===record.view.webContents.mainFrame&&event.senderFrame.url===record.url?record:null;}
 return {open,publish,trusted,closeAll,destroy,layout,visible:()=>!!record?.visible,section:()=>record?.section,size(section){if(record){record.section=section;layout();}},get:()=>record?.view};
}
module.exports={createToolWindows,panelSize,anchoredBelow};

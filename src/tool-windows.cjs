const path=require('node:path'),{pathToFileURL}=require('node:url');
const {createStateTransport}=require('./performance.cjs');
// One reusable browser-owned surface. Native web pages remain visible underneath.
function createToolWindows({WebContentsView,parent,snapshot,onClosed=()=>{}}){
 let record=null,idle,sequence=0;
 function publish(){if(record?.ready&&!record.view.webContents.isDestroyed())record.view.webContents.send('state',record.transport.prepare({...snapshot(),images:{},imageRevision:'panel',bookmarks:[],folders:[]}));}
 function layout(){if(!record?.visible)return;const [w,h]=parent().getContentSize(),compact=record.section.startsWith('quick-');const gmail=record.section==='quick-gmail',width=Math.min(compact?344:780,w-32),height=Math.min(gmail?310:compact?430:620,h-76);record.view.setBounds({x:gmail?Math.max(8,Math.min(w-width-8,Math.round(Number(record.anchor?.x)||16))):compact?16:Math.round((w-width)/2),y:gmail?Math.max(48,Math.min(h-height-8,Math.round(Number(record.anchor?.y)||80))):compact?h-height-54:Math.max(50,Math.round((h-height)/2)),width,height});}
 function destroy(){clearTimeout(idle);if(record){if(parent()&&!parent().isDestroyed())parent().contentView.removeChildView(record.view);if(!record.view.webContents.isDestroyed())record.view.webContents.close();record=null;}}
 function closeAll(){sequence++;if(!record)return;record.visible=false;record.view.setVisible(false);record.view.webContents.send('gmail-preview',{messages:[]});record.view.webContents.send('panel-hidden');onClosed('settings');clearTimeout(idle);idle=setTimeout(destroy,3000);idle.unref?.();}
 async function open(section='appearance',anchor){
  if(!/^[a-z-]+$/.test(section))return;const gen=++sequence;clearTimeout(idle);
  if(!record){const url=pathToFileURL(path.join(__dirname,'index.html'));url.searchParams.set('tool','panel');url.searchParams.set('section',section);const view=new WebContentsView({webPreferences:{preload:path.join(__dirname,'preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false}});view.setBorderRadius(14);view.setBackgroundColor('#00000000');view.setVisible(false);parent().contentView.addChildView(view);record={view,url:url.href,ready:false,visible:false,section,transport:createStateTransport()};view.webContents.setWindowOpenHandler(()=>({action:'deny'}));view.webContents.on('will-navigate',e=>e.preventDefault());record.loaded=view.webContents.loadURL(url.href);}
  const current=record;await current.loaded;if(record!==current||gen!==sequence)return;current.ready=true;current.visible=true;current.section=section;current.anchor=anchor;publish();layout();parent().contentView.addChildView(current.view);current.view.setVisible(true);current.view.webContents.send('open-panel',section);if(section!=='quick-gmail')current.view.webContents.focus();
 }
 function trusted(event){return record&&event.sender===record.view.webContents&&event.senderFrame===record.view.webContents.mainFrame&&event.senderFrame.url===record.url?record:null;}
 return {open,publish,trusted,closeAll,destroy,layout,visible:()=>!!record?.visible,section:()=>record?.section,size(section){if(record){record.section=section;layout();}},get:()=>record?.view};
}
module.exports={createToolWindows};

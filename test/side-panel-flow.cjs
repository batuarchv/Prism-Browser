// chrome.sidePanel in the smoke run: two local fixture extensions in the isolated test profile.
// 1) manifest side_panel + setPanelBehavior({openPanelOnActionClick}) from the service worker;
// 2) Claude-style: action.onClicked → sidePanel.setOptions({tabId,path}) → sidePanel.open({tabId}), panel stays with its tab.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
function fixture(root,name,files){const dir=path.join(root,name);fs.mkdirSync(dir,{recursive:true});for(const [file,body] of Object.entries(files))fs.writeFileSync(path.join(dir,file),typeof body==='string'?body:JSON.stringify(body));return dir;}
exports.run=async({app,action,snapshot,services,sidePanels,makeTab,selectTab,tab,base,settings})=>{
 const root=path.join(app.getPath('userData'),'side-panel-fixtures');
 const panelJS="document.title='panel:'+typeof chrome.sidePanel?.open+':'+location.search;";
 const docked=await services.installExtension(fixture(root,'docked',{
  'manifest.json':{manifest_version:3,name:'Side panel fixture',version:'1.0',permissions:['sidePanel'],side_panel:{default_path:'panel.html'},action:{default_title:'Fixture'},background:{service_worker:'sw.js'},options_page:'options.html'},
  'sw.js':"chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});",
  'panel.html':'<h1>Side panel fixture</h1><script src="panel.js"></script>','panel.js':panelJS,'options.html':'<title>Fixture options</title><h1>Options</h1>'}),false);
 const row=()=>snapshot().extensions.find(e=>e.id===docked.id);
 assert.equal(row().hasSidePanel,true);assert.equal(row().hasPopup,false);
 assert.ok(require('../src/ui-logic.js').panelExtensions(snapshot().extensions).some(e=>e.id===docked.id),'side-panel extensions are listed in the toolbar');
 await eventually(()=>sidePanels().behavior(docked.id).openPanelOnActionClick,'service worker reached chrome.sidePanel.setPanelBehavior');
 selectTab(tab.id);const before=tab.view.getBounds().width;
 await action('extension-action',{id:docked.id});
 assert.equal(snapshot().sidePanel?.id,docked.id,'toolbar click opens the docked panel');
 await eventually(async()=>{const wc=sidePanels().webContents();return wc&&!wc.isLoading()&&(await wc.executeJavaScript('document.title'))==='panel:function:';},'panel page loaded with chrome.sidePanel');
 assert.equal(tab.view.getBounds().width,before-snapshot().sidePanel.width-6,'the page makes room for the panel');
 assert.deepEqual(await sidePanels().webContents().executeJavaScript('chrome.sidePanel.getOptions({})'),{path:'panel.html',enabled:true});
 await action('side-panel-resize',480);await action('side-panel-finish-resize');assert.equal(snapshot().sidePanel.width,480);assert.equal(settings.sidePanels.widths[docked.id],480,'width is remembered per extension');
 await action('extension-action',{id:docked.id});assert.equal(snapshot().sidePanel,null,'toolbar click toggles it closed');
 assert.equal(tab.view.getBounds().width,before);
 await action('extension-action',{id:docked.id});assert.equal(snapshot().sidePanel.width,480);await action('side-panel-close');assert.equal(snapshot().sidePanel,null);
 // Options open as a tab, as in Chrome.
 const tabsBefore=snapshot().tabs.length;await action('extension',{command:'options',id:docked.id});
 await eventually(()=>snapshot().tabs.some(t=>t.url===docked.url+'/options.html'||t.url===docked.url+'options.html'),'options page opened in a tab');assert.equal(snapshot().tabs.length,tabsBefore+1);
 const optionsTab=snapshot().tabs.find(t=>t.url.endsWith('/options.html'));await action('close',optionsTab.id);
 // Claude-style per-tab flow.
 const claude=await services.installExtension(fixture(root,'per-tab',{
  'manifest.json':{manifest_version:3,name:'Per-tab side panel fixture',version:'1.0',permissions:['sidePanel','tabs'],action:{default_title:'Open'},background:{service_worker:'sw.js'}},
  'sw.js':"chrome.action.onClicked.addListener(async tab=>{await chrome.sidePanel.setOptions({tabId:tab.id,path:'panel.html?tabId='+tab.id,enabled:true});await chrome.sidePanel.open({tabId:tab.id});});",
  'panel.html':'<h1>Per tab</h1><script src="panel.js"></script>','panel.js':panelJS}),false);
 assert.equal(snapshot().extensions.find(e=>e.id===claude.id).hasSidePanel,true);
 await delay(800);selectTab(tab.id);
 await action('extension-action',{id:claude.id});
 await eventually(()=>snapshot().sidePanel?.id===claude.id,'action.onClicked opened the per-tab panel');
 const id=tab.view.webContents.id;await eventually(async()=>{const wc=sidePanels().webContents();return wc&&!wc.isLoading()&&(await wc.executeJavaScript('document.title'))===`panel:function:?tabId=${id}`;},'per-tab panel page loaded');
 const other=makeTab(base+'/other');await eventually(()=>!other.loading&&other.view,'second tab');assert.equal(snapshot().sidePanel,null,'a tab-opened panel does not follow other tabs');
 selectTab(tab.id);assert.equal(snapshot().sidePanel?.id,claude.id,'and comes back with its tab');
 await action('side-panel-close');assert.equal(snapshot().sidePanel,null);
 for(const e of [docked,claude])await services.extensionAction('remove',e.id);
 return ['chrome.sidePanel manifest panel and openPanelOnActionClick','chrome.sidePanel per-tab open from action.onClicked','side panel resize memory','extension options open as a tab'];
};

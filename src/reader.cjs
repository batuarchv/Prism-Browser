// Reader view (0.45): the article of the page in a clean reading layout over the tab, like Safari Reader. The
// article is found by reader-extract.js in an isolated world of the page and drawn by reader.html from a tree of
// allowed elements, so no page script or markup reaches Prism. One reading surface exists; it shows over the active
// tab when that tab has Reader on, and a tab leaves Reader when it navigates. Links open in the tab (⌘-click: new tab).
const fs=require('node:fs'),path=require('node:path');
const WORLD=1999;let source=null;
const script=call=>(source??=fs.readFileSync(path.join(__dirname,'reader-extract.js'),'utf8'))+'\n;'+call;
const FONTS=['system','newyork','charter','iowan'],THEMES=['auto','light','sepia','gray','dark'];
function prefsOf(value={}){return {font:FONTS.includes(value.font)?value.font:'newyork',size:Number.isFinite(value.size)?Math.max(14,Math.min(30,Math.round(value.size))):19,theme:THEMES.includes(value.theme)?value.theme:'auto',width:['narrow','normal','wide'].includes(value.width)?value.width:'normal'};}
function createReader({WebContentsView,parent,surfaces,look,openURL,changed=()=>{},prefs=()=>({}),savePrefs=()=>{}}){
 let view=null,ready=null,shownFor=null;const articles=new Map();
 async function run(wc,call){return wc.executeJavaScriptInIsolatedWorld(WORLD,[{code:script(call)}]);}
 // Cheap check for the address-bar button.
 async function probe(wc){try{return !!await run(wc,'PrismReader.probe(document)');}catch{return false;}}
 async function extract(wc){try{return await run(wc,'PrismReader.extract(document,location.href)');}catch{return null;}}
 function ensure(session){if(view&&!view.webContents.isDestroyed()&&view.webContents.session===session)return view;destroy();
  view=new WebContentsView({webPreferences:{preload:surfaces.preload,sandbox:true,contextIsolation:true,nodeIntegration:false,session,spellcheck:false}});view.setBorderRadius(10);view.setVisible(false);
  const mine=view;surfaces.register(view.webContents,{
   command:(name,value)=>{if(view!==mine)return;if(name==='close'&&shownFor!=null)close(shownFor);
    else if(name==='open'&&typeof value?.url==='string'&&/^https?:\/\//i.test(value.url))openURL(value.url,!!value.newTab,shownFor);
    else if(name==='prefs')savePrefs(prefsOf({...prefs(),...value}));},
   ask:name=>name==='article'&&shownFor!=null?{article:articles.get(shownFor)||null,prefs:prefsOf(prefs()),...look()}:null});
  view.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='Escape'&&shownFor!=null){event.preventDefault();close(shownFor);}});
  view.webContents.on('render-process-gone',()=>{if(view===mine)destroy();});
  ready=view.webContents.loadFile(surfaces.page('reader.html')).catch(()=>{});return view;}
 function destroy(){const v=view;view=null;shownFor=null;if(!v)return;try{parent()?.contentView.removeChildView(v);}catch{}if(!v.webContents.isDestroyed())v.webContents.close();}
 // Turns Reader on for a tab. Returns {error} when the page has no article.
 async function open(tab){const wc=tab?.view?.webContents;if(!wc||wc.isDestroyed())return {error:'Open a page first.'};
  const article=await extract(wc);if(!article||article.chars<300||!article.tree?.length)return {error:'Reader isn’t available for this page.'};
  articles.set(tab.id,article);const v=ensure(wc.session);await ready;if(view!==v)return {error:'Reader closed.'};
  const owner=parent();if(owner&&!owner.isDestroyed()&&!owner.contentView.children.includes(v))owner.contentView.addChildView(v);
  shownFor=tab.id;surfaces.send(v.webContents,{type:'article',article,prefs:prefsOf(prefs()),...look()});changed();return {ok:true};}
 function close(tabId){const had=articles.delete(tabId);if(shownFor===tabId){shownFor=null;if(view){view.setVisible(false);view._prismOn=false;}}if(had)changed(tabId);}
 function isOn(tabId){return articles.has(tabId);}
 // Called from layout(): shows the surface over the active tab's area when that tab is in Reader.
 function place(area,visible,activeTab){if(!view||view.webContents.isDestroyed())return;const on=visible&&activeTab!=null&&articles.has(activeTab);
  if(on&&shownFor!==activeTab){shownFor=activeTab;surfaces.send(view.webContents,{type:'article',article:articles.get(activeTab),prefs:prefsOf(prefs()),...look()});}
  if(on){view.setBounds(area);if(!view._prismOn){const owner=parent();if(owner&&!owner.isDestroyed()){owner.contentView.removeChildView(view);owner.contentView.addChildView(view);}}}
  view.setVisible(on);if(on&&!view._prismOn)view.webContents.focus();view._prismOn=on;}
 function restyle(){if(view&&!view.webContents.isDestroyed())surfaces.send(view.webContents,{type:'look',prefs:prefsOf(prefs()),...look()});}
 return {open,close,isOn,probe,extract,place,restyle,destroy,view:()=>view,prefs:()=>prefsOf(prefs())};
}
module.exports={createReader,prefsOf,FONTS,THEMES};

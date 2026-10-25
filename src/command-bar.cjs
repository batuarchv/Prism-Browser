// Command bar (0.32, ⌘K): one glass field that finds open tabs, favorites, bookmarks, history, archived tabs and
// Prism's own actions. Results are ranked here in the browser; the bar's page only shows them. The bar is a child
// window (native material and shadow); it stays loaded for a short while after closing so ⌘K opens it at once.
const WIDTH=640,KEEP_WARM_MS=2*60*1000,MAX=9;
function words(text){return String(text||'').toLowerCase();}
// Higher is better; 0 means no match. Title matches beat address matches; word starts beat anywhere.
function score(query,title,detail='',keywords=''){
 const q=words(query).trim();if(!q)return 1;const t=words(title),d=words(detail);
 if(keywords&&!t.includes(q)&&words(keywords).split(/\s+/).some(w=>w.startsWith(q)))return 50;
 if(t===q)return 120;if(t.startsWith(q))return 100;if(t.split(/[\s\-–—·|/:_.]+/).some(w=>w.startsWith(q)))return 80;if(t.includes(q))return 60;
 const host=d.replace(/^https?:\/\/(www\.)?/,'');if(host.startsWith(q))return 70;if(d.includes(q))return 35;
 let i=0;for(const ch of t)if(ch===q[i])i++;return i===q.length&&q.length>1?12:0;
}
const KIND_WEIGHT={go:1000,ai:900,tab:18,favorite:14,bookmark:10,action:8,archive:4,history:0};
// entries: [{id,kind,title,detail,keywords?}] → the best MAX, one per address (a tab beats its bookmark or history row).
function rank(query,entries,max=MAX){
 const seen=new Set(),out=[];
 const scored=entries.map(e=>({e,s:e.kind==='go'||e.kind==='ai'?1:score(query,e.title,e.detail,e.keywords)})).filter(x=>x.s>0).sort((a,b)=>(b.s+(KIND_WEIGHT[b.e.kind]||0))-(a.s+(KIND_WEIGHT[a.e.kind]||0)));
 for(const {e} of scored){const key=e.kind!=='action'&&e.kind!=='go'&&e.detail?e.detail:e.id;if(seen.has(key))continue;seen.add(key);out.push(e);if(out.length>=max)break;}
 return out;
}
function createCommandBar({BrowserWindow,parent,surfaces,entries,run,look,decorate=()=>{},ask=null}){
 let current=null,idle=null,generation=0;
 function bounds(height){const owner=parent(),b=owner.getContentBounds(),width=Math.min(WIDTH,b.width-48);return {x:Math.round(b.x+(b.width-width)/2),y:Math.round(b.y+Math.max(40,b.height*.16)),width,height:Math.round(Math.max(60,Math.min(height,b.height-80)))};}
 function destroy(){clearTimeout(idle);const c=current;current=null;if(c&&!c.win.isDestroyed())c.win.destroy();}
 function hide(){if(!current||current.win.isDestroyed())return;current.visible=false;current.win.hide();surfaces.send(current.win.webContents,{type:'reset'});clearTimeout(idle);idle=setTimeout(destroy,KEEP_WARM_MS);idle.unref?.();}
 function create(){
  const win=new BrowserWindow({parent:parent(),...bounds(64),show:false,frame:false,transparent:true,backgroundColor:'#00000000',vibrancy:'popover',visualEffectState:'active',roundedCorners:true,hasShadow:true,resizable:false,movable:false,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,webPreferences:{preload:surfaces.preload,sandbox:true,contextIsolation:true,nodeIntegration:false}});
  const record={win,visible:false,ready:null};current=record;decorate(win.webContents);
  surfaces.register(win.webContents,{
   ask:(name,value)=>name==='query'&&typeof value==='string'?rank(value.slice(0,300),entries(value.slice(0,300))):name==='ai'&&typeof value==='string'&&ask?ask(value.slice(0,2000)):null,
   command:(name,value)=>{if(current!==record)return;if(name==='close')hide();else if(name==='size'&&Number.isFinite(value?.height)&&record.visible){const owner=parent();if(owner&&!owner.isDestroyed())win.setBounds(bounds(value.height));}
    else if(name==='run'&&value&&typeof value.id==='string'){hide();Promise.resolve().then(()=>run(value.id,{query:String(value.query||'').slice(0,8192),alt:!!value.alt})).catch(()=>{});}}
  });
  win.on('blur',()=>setTimeout(()=>{if(current===record&&record.visible&&!win.isDestroyed()&&!win.isFocused())hide();},0));
  record.ready=win.loadFile(surfaces.page('command-bar.html')).catch(()=>{});
  return record;
 }
 async function open(initial=''){
  const owner=parent();if(!owner||owner.isDestroyed())return;const gen=++generation;clearTimeout(idle);
  if(current?.visible){hide();return;}
  const record=current&&!current.win.isDestroyed()?current:create();await record.ready;if(gen!==generation||current!==record)return;
  record.visible=true;record.win.setBounds(bounds(64));surfaces.send(record.win.webContents,{type:'open',query:initial,...look()});record.win.show();record.win.focus();record.win.webContents.focus();
 }
 return {open,hide,destroy,visible:()=>!!current?.visible};
}
module.exports={createCommandBar,rank,score};

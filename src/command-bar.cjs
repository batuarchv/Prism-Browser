// Command bar (0.32, ⌘K): one glass field that finds open tabs, favorites, bookmarks, history, archived tabs and
// Prism's own actions. Results are ranked here in the browser; the bar's page only shows them. The bar is a child
// window (native material and shadow); it stays loaded for 20 s after closing (0.40; was 2 minutes) so ⌘T opens it
// again at once, then its renderer ends.
const WIDTH=640,KEEP_WARM_MS=20*1000,MAX=9;
function words(text){return String(text||'').toLowerCase();}
const bare=url=>words(url).replace(/^[a-z][a-z0-9+.-]*:\/\/(www\.)?/,'');
// One row per page: http/https, www. and a trailing slash or #fragment do not make a different page.
const pageKey=url=>bare(url).replace(/#.*$/,'').replace(/\/$/,'');
// Higher is better; 0 means no match. Title matches beat address matches; word starts beat anywhere. Several words
// match when each appears in the title or address, in any order ("pr review github").
function score(query,title,detail='',keywords=''){
 const q=words(query).trim();if(!q)return 1;const t=words(title),d=words(detail);
 if(keywords&&!t.includes(q)&&words(keywords).split(/\s+/).some(w=>w.startsWith(q)))return 50;
 const host=bare(d);if(host.startsWith(q)&&!/\s/.test(q))return 95;
 if(t===q)return 120;if(t.startsWith(q))return 100;if(t.split(/[\s\-–—·|/:_.]+/).some(w=>w.startsWith(q)))return 80;if(t.includes(q))return 60;
 if(host.split(/[./]/).some(w=>w.startsWith(q)))return 55;if(d.includes(q))return 35;
 const parts=q.split(/\s+/);if(parts.length>1&&parts.every(p=>t.includes(p)||host.includes(p)))return 45;
 let i=0;for(const ch of t)if(ch===q[i])i++;if(i===q.length&&q.length>1)return 12;
 i=0;for(const ch of host)if(ch===q[i])i++;return i===q.length&&q.length>2?10:0;
}
const KIND_WEIGHT={go:1000,ai:900,tab:22,favorite:16,bookmark:12,action:8,history:6,archive:4};
// How often and how lately a page was visited (0.44): one you open every day comes before one you saw once last month.
function frecency(e,now=Date.now()){const visits=Math.min(64,Number(e.visits)||0),age=Number.isFinite(e.visitedAt)?(now-e.visitedAt)/36e5:Infinity;
 return Math.round(Math.log2(1+visits)*6)+(age<1?20:age<24?14:age<24*7?8:age<24*30?3:0);}
// Inline completion (0.44, like Safari and Chrome): typing the start of a site you use ("yo", "gith") puts that site
// above the web search, so Return opens it. Only sites you visit often or lately, open tabs and favorites qualify, and
// only for a single word, so ordinary searches still search.
function completion(q,entries,now){if(!q||q.length<2||/\s/.test(q))return null;let best=null,bestScore=0;
 for(const e of entries){if(!['tab','favorite','bookmark','history'].includes(e.kind)||!e.detail)continue;const host=bare(e.detail);if(!host.startsWith(q))continue;
  const f=frecency(e,now),strong=e.kind==='tab'||e.kind==='favorite'||(Number(e.visits)||0)>=2||f>=8;if(!strong)continue;
  // The site itself beats a deep page on it: github.com before github.com/some/repo.
  const s=f+(KIND_WEIGHT[e.kind]||0)-Math.min(20,pageKey(e.detail).split('/').length*4-4);if(s>bestScore){best=e;bestScore=s;}}
 return best;}
// entries: [{id,kind,title,detail,keywords?,visits?,visitedAt?}] → the best MAX, one per page (a tab beats its
// bookmark or history row). With nothing typed, entries keep the order they came in (recent tabs, then recent pages).
function rank(query,entries,max=MAX,now=Date.now()){
 const seen=new Set(),out=[],q=words(query).trim();
 const add=e=>{const key=e.kind!=='action'&&e.kind!=='go'&&e.kind!=='ai'&&e.detail?pageKey(e.detail):e.id;if(seen.has(key))return;seen.add(key);out.push(e);};
 if(!q){for(const e of entries){add(e);if(out.length>=max)break;}return out;}
 const scored=entries.map(e=>({e,s:e.kind==='go'||e.kind==='ai'?1:score(q,e.title,e.detail,e.keywords)})).filter(x=>x.s>0).map(x=>({...x,s:x.s+(KIND_WEIGHT[x.e.kind]||0)+(x.e.kind==='action'?0:frecency(x.e,now))})).sort((a,b)=>b.s-a.s);
 const go=entries.find(e=>e.kind==='go');
 if(!go||go.icon==='search'){const top=completion(q,entries,now);if(top){const tab=top.kind!=='tab'&&entries.find(e=>e.kind==='tab'&&e.detail&&pageKey(e.detail)===pageKey(top.detail));add({...(tab||top),hint:(tab||top).kind==='tab'?'Switch to tab':'Open',completion:true});}}
 for(const {e} of scored){add(e);if(out.length>=max)break;}
 return out;
}
function createCommandBar({BrowserWindow,parent,surfaces,entries,run,look,decorate=()=>{},ask=null,image=null,suggest=null}){
 let current=null,idle=null,generation=0;
 function bounds(height){const owner=parent(),b=owner.getContentBounds(),width=Math.min(WIDTH,b.width-48);return {x:Math.round(b.x+(b.width-width)/2),y:Math.round(b.y+Math.max(40,b.height*.16)),width,height:Math.round(Math.max(60,Math.min(height,b.height-80)))};}
 function destroy(){clearTimeout(idle);const c=current;current=null;if(c&&!c.win.isDestroyed())c.win.destroy();}
 function hide(){if(!current||current.win.isDestroyed())return;current.visible=false;current.win.hide();surfaces.send(current.win.webContents,{type:'reset'});clearTimeout(idle);idle=setTimeout(destroy,KEEP_WARM_MS);idle.unref?.();}
 function create(){
  const win=new BrowserWindow({parent:parent(),...bounds(64),show:false,frame:false,transparent:true,backgroundColor:'#00000000',vibrancy:'popover',visualEffectState:'active',roundedCorners:true,hasShadow:true,resizable:false,movable:false,minimizable:false,maximizable:false,fullscreenable:false,skipTaskbar:true,webPreferences:{preload:surfaces.preload,sandbox:true,contextIsolation:true,nodeIntegration:false}});
  const record={win,visible:false,ready:null};current=record;decorate(win.webContents);
  surfaces.register(win.webContents,{
   ask:(name,value)=>name==='query'&&typeof value==='string'?rank(value.slice(0,300),entries(value.slice(0,300))):name==='ai'&&typeof value==='string'&&ask?ask(value.slice(0,2000)):name==='suggest'&&typeof value==='string'&&suggest?suggest(value.slice(0,300)):null,
   command:(name,value)=>{if(current!==record)return;if(name==='close')hide();else if(name==='size'&&Number.isFinite(value?.height)&&record.visible){const owner=parent();if(owner&&!owner.isDestroyed())win.setBounds(bounds(value.height));}
    else if(name==='image'&&value instanceof Uint8Array&&image){hide();Promise.resolve().then(()=>image(value)).catch(()=>{});}
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
// Sums in Beam (0.46): "12*(3+4)", "2^10", "15% of 80", "1 200 / 3". A small parser, never eval; anything else is not a sum.
function calc(input){let q=String(input||'').trim().replace(/[×x]/g,'*').replace(/÷/g,'/').replace(/,(?=\d{3}\b)/g,'').replace(/(\d)\s+(?=\d{3}\b)/g,'$1').replace(/^=\s*/,'');
 const of=/^([\d.]+)\s*%\s*of\s*([\d.]+)$/i.exec(q);if(of)q=`${of[1]}/100*${of[2]}`;
 if(!/^[\d\s.+\-*/%^()]+$/.test(q)||!/\d/.test(q)||!/[+\-*/%^]/.test(q.replace(/^\s*-/,'')))return null;
 let i=0;const peek=()=>{while(q[i]===' ')i++;return q[i];};
 const num=()=>{const m=/^\d*\.?\d+(?:e[+-]?\d+)?/i.exec(q.slice(i));if(!m)throw 0;i+=m[0].length;return parseFloat(m[0]);};
 const atom=()=>{const c=peek();if(c==='('){i++;const v=add();if(peek()!==')')throw 0;i++;return v;}if(c==='-'){i++;return -atom();}if(c==='+'){i++;return atom();}let v=num();if(peek()==='%'&&!/\d|\(/.test(q.slice(i+1).trim()[0]||'')){i++;v/=100;}return v;};
 const pow=()=>{const b=atom();if(peek()==='^'){i++;return b**pow();}return b;};
 const mul=()=>{let v=pow();for(;;){const c=peek();if(c==='*'){i++;v*=pow();}else if(c==='/'){i++;v/=pow();}else if(c==='%'){i++;v%=pow();}else return v;}};
 const add=()=>{let v=mul();for(;;){const c=peek();if(c==='+'){i++;v+=mul();}else if(c==='-'){i++;v-=mul();}else return v;}};
 try{const v=add();if(peek()!==undefined||!Number.isFinite(v))return null;return String(Math.abs(v)<1e15?+v.toPrecision(12):v);}catch{return null;}}
module.exports={createCommandBar,rank,score,frecency,completion,calc};

// Prism Shield in each frame (0.33, blocker.cjs). As the frame starts, before any of the page's scripts, it asks for that
// site's hiding rules and scriptlets (uBlock's, which is what removes YouTube's in-video ads) and runs them in the
// page's world. Generic hiding rules follow for the classes and ids the page uses, rechecked as the page grows.
// Nothing is exposed to the page.
const {ipcRenderer,webFrame}=require('electron');
(()=>{if(!/^https?:$/.test(location.protocol))return;
 let rules=null;try{rules=ipcRenderer.sendSync('prism-shield-frame',{url:location.href,main:process.isMainFrame});}catch{}
 if(!rules)return;
 if(rules.script)try{webFrame.executeJavaScript(rules.script).catch(()=>{});}catch{}
 if(rules.styles)try{webFrame.insertCSS(rules.styles,{cssOrigin:'user'});}catch{}
 // 0.33.1: only the page itself is scanned (frames keep their site rules and base styles), and only when the renderer is
 // idle: the observer just queues new elements, which are read in small slices; at most one request a second goes out
 // after the first moments, and scanning stops after three minutes, when a page has long since taken shape.
 if(!process.isMainFrame)return;
 const seen={classes:new Set(),ids:new Set(),hrefs:new Set()};let fresh={classes:[],ids:[],hrefs:[]},queue=[],full=false,idle=0,timer=null,sends=0;const born=Date.now();
 const add=(kind,value)=>{if(value&&value.length<300&&!seen[kind].has(value)&&seen[kind].size<20000){seen[kind].add(value);fresh[kind].push(value);}};
 const note=el=>{if(el.id)add('ids',el.id);const list=el.classList;for(let i=0;i<list.length;i++)add('classes',list[i]);if(el.tagName==='A')add('hrefs',el.getAttribute('href'));};
 const send=()=>{timer=null;if(!fresh.classes.length&&!fresh.ids.length&&!fresh.hrefs.length)return;const batch=fresh;fresh={classes:[],ids:[],hrefs:[]};sends++;
  ipcRenderer.invoke('prism-shield-dom',{url:location.href,main:true,...batch}).then(styles=>{if(styles)webFrame.insertCSS(styles,{cssOrigin:'user'});}).catch(()=>{});};
 const later=()=>{if(!timer)timer=setTimeout(send,sends<3?60:1000);};
 // Read queued elements and their descendants while the renderer has time to spare.
 const work=deadline=>{idle=0;if(full){full=false;queue=[document.documentElement];}
  while(queue.length&&deadline.timeRemaining()>2){const root=queue.pop();if(!root.isConnected)continue;note(root);const list=root.getElementsByTagName('*');const cap=root===document.documentElement?15000:4000;for(let i=0;i<list.length&&i<cap;i++)note(list[i]);}
  if(queue.length)idle=requestIdleCallback(work,{timeout:1000});later();};
 const schedule=()=>{if(!idle)idle=requestIdleCallback(work,{timeout:1000});};
 const begin=()=>{queue.push(document.documentElement);schedule();
  const observer=new MutationObserver(changes=>{if(Date.now()-born>180000){observer.disconnect();return;}if(full)return;for(const change of changes)for(const node of change.addedNodes)if(node.nodeType===1){if(queue.length>=2000){full=true;queue=[];break;}queue.push(node);}schedule();});
  observer.observe(document.documentElement,{childList:true,subtree:true});};
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();

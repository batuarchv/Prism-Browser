// Prism Shield in each frame (0.33, blocker.cjs). As the frame starts, before any of the page's scripts, it asks for that
// site's hiding rules and scriptlets (uBlock's, which is what removes YouTube's in-video ads) and runs them in the
// page's world. Generic hiding rules follow for the classes and ids the page uses, rechecked as the page grows.
// Nothing is exposed to the page.
const {ipcRenderer,webFrame}=require('electron');
(()=>{if(!/^https?:$/.test(location.protocol))return;
 let rules=null;try{rules=ipcRenderer.sendSync('prism-shield-frame',{url:location.href,main:process.isMainFrame});}catch{}
 if(!rules)return;
 for(const script of rules.scripts||[])try{webFrame.executeJavaScript(script).catch(()=>{});}catch{}
 if(rules.styles)try{webFrame.insertCSS(rules.styles,{cssOrigin:'user'});}catch{}
 const seen={classes:new Set(),ids:new Set(),hrefs:new Set()};let fresh={classes:[],ids:[],hrefs:[]},timer=null,rounds=0;
 const add=(kind,value)=>{if(value&&value.length<300&&!seen[kind].has(value)&&seen[kind].size<20000){seen[kind].add(value);fresh[kind].push(value);}};
 const note=el=>{if(el.id)add('ids',el.id);for(const c of el.classList||[])add('classes',c);if(el.tagName==='A')add('hrefs',el.getAttribute('href'));};
 const scan=root=>{if(!root?.querySelectorAll)return;if(root.nodeType===1)note(root);const list=root.querySelectorAll('[id],[class],a[href]');for(let i=0;i<list.length&&i<6000;i++)note(list[i]);};
 const send=()=>{timer=null;if(!fresh.classes.length&&!fresh.ids.length&&!fresh.hrefs.length)return;const batch=fresh;fresh={classes:[],ids:[],hrefs:[]};
  ipcRenderer.invoke('prism-shield-dom',{url:location.href,main:process.isMainFrame,...batch}).then(styles=>{if(styles)webFrame.insertCSS(styles,{cssOrigin:'user'});}).catch(()=>{});};
 const later=()=>{if(!timer){rounds++;timer=setTimeout(send,rounds<4?50:rounds<120?1000:5000);}};
 const start=()=>{scan(document);send();new MutationObserver(changes=>{for(const change of changes)for(const node of change.addedNodes)if(node.nodeType===1)scan(node);later();}).observe(document.documentElement,{childList:true,subtree:true});};
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

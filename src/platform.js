// Windows and Linux (Windows build, 0.50): marks every Prism page with data-platform (style.css hides Mac-only settings and makes
// room for the caption buttons) and writes the Mac key symbols in labels as Ctrl, Alt and Shift.
(()=>{const p=/^Win/i.test(navigator.platform)?'win':/^Mac/i.test(navigator.platform)?'mac':'linux';const root=document.documentElement;root.dataset.platform=p;if(p==='mac')return;
 const names={'⌃':'Ctrl','⌘':'Ctrl','⌥':'Alt','⇧':'Shift'},order=['Ctrl','Alt','Shift'],symbols=/[⌃⌘⌥⇧]/;
 const common=[['Your macOS Downloads folder','Your Downloads folder']];const words=common.concat(p==='win'?[['Match macOS','Match Windows'],['Follow macOS','Follow Windows'],['macOS Keychain','Windows data protection'],['after Touch ID','after you confirm'],['with Touch ID','after you confirm'],['this Mac','this PC'],['This Mac','This PC']]:[['Match macOS','Match system'],['Follow macOS','Follow the system'],['this Mac','this computer'],['This Mac','This computer']]);
 const fix=text=>{let out=text;if(symbols.test(out))out=out.replace(/[⌃⌘⌥⇧]+\s?(?=[^\s⌃⌘⌥⇧])/g,m=>{const set=new Set([...m.trim()].map(c=>names[c]));return order.filter(k=>set.has(k)).join('+')+'+';}).replace(/[⌃⌘⌥⇧]/g,c=>names[c]);
  for(const [a,b] of words)if(out.includes(a))out=out.split(a).join(b);return out;};
 const needs=text=>!!text&&(symbols.test(text)||/mac|Touch ID|Mac/.test(text));
 const attrs=['title','aria-label','placeholder','data-tooltip'];
 const visit=node=>{if(node.nodeType===3){if(needs(node.data)){const v=fix(node.data);if(v!==node.data)node.data=v;}return;}if(node.nodeType!==1)return;
  if(node.tagName==='SCRIPT'||node.tagName==='STYLE'||node.tagName==='TEXTAREA'||node.isContentEditable)return;
  for(const a of attrs){const v=node.getAttribute(a);if(needs(v)){const f=fix(v);if(f!==v)node.setAttribute(a,f);}}for(const c of node.childNodes)visit(c);};
 const start=()=>{visit(document.body||root);new MutationObserver(list=>{for(const m of list){if(m.type==='characterData')visit(m.target);else if(m.type==='attributes')visit(m.target);else for(const n of m.addedNodes)visit(n);}}).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs});};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();})();

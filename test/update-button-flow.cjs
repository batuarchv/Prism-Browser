// The "Restart" update control in the sidebar footer: as tall as the footer icons, centred with them, label not
// clipped, clear of Settings and Downloads, in light and dark and at the narrowest sidebar. Screenshots go to
// reports/<version>/. Runs inside the smoke suite, or alone with PRISM_TEST_FLOW=update-button-flow.cjs.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function check({win,action,setUpdateOverride,settings},shots=true){
 const dir=path.resolve(__dirname,'../reports/'+require('../package.json').version);fs.mkdirSync(dir,{recursive:true});
 setUpdateOverride({configured:true,status:'ready',version:'9.9.9'});await delay(600);
 const measure=()=>win.webContents.executeJavaScript(`(()=>{const b=document.getElementById('update-indicator'),holder=b.parentElement,others=[...holder.children].filter(x=>x!==b&&x.offsetParent);
  const r=b.getBoundingClientRect(),l=b.querySelector('.update-label'),mid=x=>x.top+x.height/2,o=others.map(x=>x.getBoundingClientRect());
  return {hidden:b.hidden,label:l.textContent,title:b.title,height:r.height,clipped:l.scrollHeight>l.clientHeight+1||l.scrollWidth>l.clientWidth+1,
   centred:o.every(x=>Math.abs(mid(x)-mid(r))<=1),clear:o.every(x=>x.right<=r.left-2||x.left>=r.right+2),fits:r.height<=Math.max(...o.map(x=>x.height)),
   box:[Math.round(holder.getBoundingClientRect().left),Math.round(holder.getBoundingClientRect().top)-8,Math.round(holder.getBoundingClientRect().width),Math.round(holder.getBoundingClientRect().height)+16]}})()`);
 const results=[];
 for(const [theme,width] of [['light',settings.sidebarWidth],['dark',settings.sidebarWidth],['dark',220],['light',220]]){
  await action('set-setting',{key:'theme',value:theme});await action('set-setting',{key:'sidebarWidth',value:width});await delay(500);
  const m=await measure();results.push(m);
  assert.equal(m.hidden,false);assert.ok(m.label.length>0&&m.title.includes('9.9.9'));
  assert.ok(!m.clipped,`label clipped (${theme}, ${width}px)`);assert.ok(m.centred,`not centred with the footer icons (${theme})`);assert.ok(m.clear,`overlaps a footer icon (${theme}, ${width}px)`);assert.ok(m.fits,'taller than the footer icons');
  if(shots){const [x,y,w,h]=m.box;fs.writeFileSync(path.join(dir,`update-button-${theme}-${width}.png`),(await win.webContents.capturePage({x,y,width:w,height:h})).toPNG());}
 }
 setUpdateOverride(null);await action('set-setting',{key:'theme',value:'system'});return results;
}
exports.check=check;
exports.run=async ctx=>{try{const r=await check(ctx);console.log(JSON.stringify(r));ctx.app.exit(0);}catch(error){console.error(error);ctx.app.exit(1);}};

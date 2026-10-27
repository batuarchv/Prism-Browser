// 0.40 look check (PRISM_TEST_FLOW=look-040-flow.cjs): the same window in light and dark, with the sidebar (favorites,
// pinned rows, tabs), Settings and the spaces popover, captured to PRISM_SHOTS so a build can be compared pixel by pixel
// with an earlier one (the 0.40 performance pass must not change how Prism looks). Local pages only.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,action,library,makeTab,selectTab,toolWindows})=>{
 const dir=process.env.PRISM_SHOTS||path.resolve(__dirname,'../reports/'+require('../package.json').version+'/look');fs.mkdirSync(dir,{recursive:true});
 const server=http.createServer((q,res)=>{res.setHeader('Content-Type','text/html');res.end(`<!doctype html><title>Page ${q.url.slice(1)||'home'}</title><body style="font:16px -apple-system;margin:40px">Page ${q.url}</body>`);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const js=code=>win.webContents.executeJavaScript(code);try{await js('typeof finishSetup==="function"&&finishSetup()');}catch{}
 win.setBounds({width:1240,height:820});app.focus({steal:true});win.focus();
 const lib=library();lib.bookmarks.push({id:'f1',title:'Docs',url:base+'/docs',folder:'',favorite:true},{id:'f2',title:'Mail',url:base+'/mail',folder:'',favorite:true},{id:'p1',title:'Pinned page',url:base+'/pinned',folder:'',favorite:false});
 for(const n of ['news','music','notes'])makeTab(base+'/'+n,false);const front=makeTab(base+'/front',true);await wait(2500);
 const shot=async(wc,name)=>{const image=await wc.capturePage();fs.writeFileSync(path.join(dir,name),image.toPNG());};
 for(const theme of ['light','dark']){
  await action('set-setting',{key:'theme',value:theme});selectTab(front.id);await wait(1500);
  // Pointer away from every control, so no hover state is captured.
  win.webContents.sendInputEvent({type:'mouseMove',x:900,y:700});await wait(400);
  await shot(win.webContents,`sidebar-${theme}.png`);
  await action('open-tool',{section:'appearance'});await wait(1500);await shot(toolWindows.get().webContents,`settings-${theme}.png`);await action('close-tools');await wait(500);
  await action('open-tool',{section:'quick-spaces',anchor:{x:120,y:60,left:20}});await wait(1200);await shot(toolWindows.get().webContents,`popover-${theme}.png`);await action('close-tools');await wait(500);
 }
 console.log('LOOK '+dir);server.close();app.exit(0);
};

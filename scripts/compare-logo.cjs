// Compares the logo and the 3D pyramid: reports/<version>/logo-side-by-side.png (previous icon · icon · Cycles still ·
// live WebGL at rest) and logo-overlay.png (the logo's edges, in red, over the still and the live render).
// Run with Electron: `electron scripts/compare-logo.cjs`.
const {app,BrowserWindow}=require('electron'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'reports',require('../package.json').version);
app.whenReady().then(async()=>{fs.mkdirSync(out,{recursive:true});
 const png=file=>{const out=path.join(app.getPath('temp'),'prism-compare-'+path.basename(path.dirname(file))+'.png');require('node:child_process').execFileSync('/usr/bin/sips',['-s','format','png','-Z','512',file,'--out',out],{stdio:'ignore'});return 'data:image/png;base64,'+fs.readFileSync(out).toString('base64');};
 const legacy=fs.existsSync(path.join(root,'design/legacy-logo/Prism-current.icns'))?png(path.join(root,'design/legacy-logo/Prism-current.icns')):'',icon=png(path.join(root,'assets/Prism-current.icns'));
 const svg=fs.readFileSync(path.join(root,'assets/prism-mark.svg'),'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/,'').replace(/<defs>[\s\S]*?<\/defs>/,'').replace(/(<svg[^>]*>)/,'$1<style>path,polygon{fill:none;stroke:#ff2d55;stroke-width:3}rect{fill:none}</style>');
 const edges='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64'),still='file://'+path.join(root,'assets/prism-glass.png');
 const cell='position:relative;width:512px;height:512px;background:#f2f3f5';
 const html=`<!doctype html><html data-theme="light"><body style="margin:0;display:grid;grid-template-columns:repeat(6,512px);gap:8px;background:#fff;font:13px -apple-system">
  <div style="${cell}"><img src="${legacy}" style="width:512px"></div>
  <div style="${cell}"><img src="${icon}" style="width:512px"></div>
  <div style="${cell}"><img src="${still}" style="width:512px"></div>
  <div style="${cell};overflow:hidden"><img id="live" src="${still}" class="x" style="width:512px;height:512px;display:block"></div>
  <div style="${cell}"><img src="${still}" style="width:512px"><img src="${edges}" style="position:absolute;inset:0;width:512px"></div>
  <div style="${cell};overflow:hidden"><img id="live2" src="${still}" style="width:512px;height:512px;display:block"><img src="${edges}" style="position:absolute;inset:0;width:512px;z-index:5"></div>
  <style>img.glass-fallback{visibility:hidden}</style>
  <script src="file://${path.join(root,'src/glass-model.js')}"></script><script src="file://${path.join(root,'src/glass-logo.js')}"></script>
  <script>for(const id of ['live','live2'])PrismGlass.upgrade(document.getElementById(id),{beam:false,place:'compare'});</script></body></html>`;
 const file=path.join(app.getPath('temp'),'prism-compare.html');fs.writeFileSync(file,html);
 const win=new BrowserWindow({width:3112,height:512,useContentSize:true,show:false,webPreferences:{sandbox:true}});await win.loadFile(file);await new Promise(r=>setTimeout(r,1200));
 const page=await win.webContents.capturePage(),k=page.getSize().width/3112,shot=async(name,{x,y,width,height})=>fs.writeFileSync(path.join(out,name),page.crop({x:Math.round(x*k),y:Math.round(y*k),width:Math.round(width*k),height:Math.round(height*k)}).toPNG());
 await shot('logo-side-by-side.png',{x:0,y:0,width:2072,height:512});await shot('logo-overlay.png',{x:2080,y:0,width:1032,height:512});
 fs.rmSync(file,{force:true});console.log('wrote',out);app.exit(0);
});

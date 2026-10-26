// Rasterises the logo (assets/prism-mark.svg) to its transparent PNGs: prism-mark-flat.png (1024², the colours the 3D
// pyramid wears), prism-current-mark.png (512², the browser and profile UI) and prism-icon-layer.png (1024², the mark at
// 82% for icon layers). Run with Electron after scripts/draw-mark.cjs.
const {app,BrowserWindow}=require('electron'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
app.whenReady().then(async()=>{const win=new BrowserWindow({show:false,width:1024,height:1024,transparent:true,webPreferences:{sandbox:true}});
 const svg='data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,'assets/prism-mark.svg')).toString('base64');
 await win.loadURL('data:text/html,'+encodeURIComponent('<body style="margin:0"><canvas id="c" width="1024" height="1024"></canvas></body>'));
 const draw=(size,scale)=>win.webContents.executeJavaScript(`new Promise(r=>{const i=new Image();i.onload=()=>{const c=document.getElementById('c');c.width=c.height=${size};const g=c.getContext('2d'),w=${size}*${scale};g.drawImage(i,(${size}-w)/2,(${size}-w)/2,w,w);r(c.toDataURL('image/png'));};i.src=${JSON.stringify(svg)};})`);
 for(const [name,size,scale] of [['prism-mark-flat.png',1024,1],['prism-current-mark.png',512,1],['prism-icon-layer.png',1024,.822]]){
  fs.writeFileSync(path.join(root,'assets',name),Buffer.from((await draw(size,scale)).split(',')[1],'base64'));console.log('wrote assets/'+name);}
 app.exit(0);});

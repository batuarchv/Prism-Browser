// Run with Electron: renders background.html to 1x and 2x PNGs for the DMG window (660×420 points).
// The design is sized in viewport units, so one page is captured at both window sizes.
const {app,BrowserWindow}=require('electron'),fs=require('node:fs'),path=require('node:path');
const out=process.argv.at(-1),delay=ms=>new Promise(r=>setTimeout(r,ms));
app.whenReady().then(async()=>{
 try{
  const win=new BrowserWindow({show:false,width:660,height:420,useContentSize:true,enableLargerThanScreen:true,webPreferences:{offscreen:true,sandbox:true,contextIsolation:true}});
  await win.loadFile(path.join(__dirname,'background.html'));
  for(const [scale,name] of [[1,'background.png'],[2,'background@2x.png']]){win.setContentSize(660*scale,420*scale);await delay(600);
   const image=await win.webContents.capturePage({x:0,y:0,width:660*scale,height:420*scale});const size=image.getSize();if(size.width<660*scale)throw Error('Capture was '+size.width+'px wide.');fs.writeFileSync(path.join(out,name),image.resize({width:660*scale,height:420*scale}).toPNG());}
  app.exit(0);
 }catch(error){console.error(error);app.exit(1);}
});

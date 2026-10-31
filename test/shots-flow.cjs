// Development screenshots (smoke profile): site controls, Settings, Spaces. SHOTS=dir
const http=require('node:http'),{execFileSync}=require('node:child_process'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,selectTab,action,toolWindows,setDeviceChooser})=>{
 const out=process.env.SHOTS||'/tmp';const shot=name=>{try{if(process.platform==='darwin'){const b=win.getBounds();execFileSync('screencapture',['-x','-R'+[b.x,b.y,b.width,b.height].join(','),path.join(out,name+'.png')]);}else execFileSync('import',['-window','root',path.join(out,name+'.png')]);}catch(e){console.log('shot failed',e.message);}};
 const server=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end('<title>Example Studio</title><body style="font:15px system-ui;padding:40px;background:linear-gradient(135deg,#f6d365,#fda085 40%,#84fab0)"><h1>Example Studio</h1><p>Colourful page so glass has something to show.</p>'+('<p>Lorem ipsum dolor sit amet. </p>'.repeat(30))+'</body>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});win.setContentSize(1240,800);
  const t=makeTab('http://localhost:'+server.address().port+'/');selectTab(t.id);await delay(2500);
  await t.view.webContents.executeJavaScript("navigator.geolocation.getCurrentPosition(()=>{},()=>{});Notification.requestPermission();true",true).catch(()=>{});await delay(1500);
  if(setDeviceChooser){setDeviceChooser(async()=>0);await new Promise(r=>t.view.webContents.session.emit('select-serial-port',{preventDefault(){}},[{portId:'p',portName:'cu.usbmodem',displayName:'Keychron Q1 Pro',vendorId:0x3434,productId:0x0610}],t.view.webContents,r));await t.view.webContents.executeJavaScript('navigator.requestMIDIAccess().catch(()=>{})',true).catch(()=>{});await delay(500);}
  for(const w of require('electron').BrowserWindow.getAllWindows())if(w!==win&&!w.isDestroyed())w.close();
  await delay(500);shot('0-page');
  const sections=(process.env.SECTIONS||'quick-site,appearance,quick-spaces,quick-extensions').split(',');
  for(const s of sections){await win.webContents.executeJavaScript(`openPanel(${JSON.stringify(s)})`);await delay(1800);shot('1-'+s);await win.webContents.executeJavaScript('closePanel()');await delay(500);}
 }finally{server.close();app.exit(0);}
};

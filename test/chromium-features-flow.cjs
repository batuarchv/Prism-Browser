// 0.43 Chromium features in the smoke run (isolated test profile): clean Copy page link, device access (WebHID/Web
// Serial chooser, remembered per site, site popover, Settings list), MIDI asking like other permissions, screen
// sharing chooser, HTTP sign-in sheet, Save Page As, and the extension right-click menu and no-popup click.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(check,message,ms=8000){const deadline=Date.now()+ms;while(!await check()){if(Date.now()>deadline)throw Error(message);await delay(100);}}
function fixture(root,name,files){const dir=path.join(root,name);fs.mkdirSync(dir,{recursive:true});for(const [file,body] of Object.entries(files))fs.writeFileSync(path.join(dir,file),typeof body==='string'?body:JSON.stringify(body));return dir;}
exports.run=async({app,win,makeTab,selectTab,action,snapshot,services,devices,setDeviceChooser,extensionMenuTemplate})=>{
 const {clipboard,dialog,BrowserWindow,session}=require('electron');
 const server=http.createServer((q,r)=>{
  if(q.url.startsWith('/private')){const ok=q.headers.authorization==='Basic '+Buffer.from('ada:lovelace').toString('base64');
   if(!ok){r.writeHead(401,{'WWW-Authenticate':'Basic realm="Staging"','Content-Type':'text/html'});r.end('<title>Denied</title>');return;}
   r.writeHead(200,{'Content-Type':'text/html'});r.end('<title>Signed in</title><p>Welcome</p>');return;}
  r.writeHead(200,{'Content-Type':'text/html'});r.end('<title>Device lab</title><button id=b>Go</button><p>Plain page</p>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://localhost:'+server.address().port;
 const realBox=dialog.showMessageBox,realSave=dialog.showSaveDialog;
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});
  const t=makeTab(base+'/?utm_source=news&id=7&fbclid=abc');selectTab(t.id);const wc=()=>t.view.webContents;
  await eventually(()=>t.view&&!wc().isLoading()&&wc().getTitle()==='Device lab','test page loads');

  // ⌃⇧C copies the link without tracking parameters.
  await action('copy-page-url');assert.equal(await clipboard.readText(),base+'/?id=7','Copy page link drops utm_* and fbclid');

  // Device APIs exist on secure pages, and a chooser answer is remembered for the site.
  assert.equal(await wc().executeJavaScript('typeof navigator.hid+typeof navigator.serial+typeof navigator.usb'),'objectobjectobject','WebHID, Web Serial and WebUSB are available');
  const asked=[];setDeviceChooser(async request=>{asked.push(request);return request.type==='hid'?null:0;});
  const hid=await wc().executeJavaScript('navigator.hid.requestDevice({filters:[]}).then(d=>"devices:"+d.length,e=>e.name)',true);
  assert.equal(asked.at(-1)?.type,'hid','requestDevice reaches the HID chooser');assert.equal(asked.at(-1).host,new URL(base).host);
  assert.ok(['devices:0','NotFoundError'].includes(hid),'cancelling the chooser gives the page no device: '+hid);assert.equal(devices().rows().length,0,'nothing remembered after cancelling');
  // A port as Chromium reports it, through the same session event the browser uses.
  const ses=wc().session,port={portId:'p1',portName:'cu.usbmodem1101',displayName:'Pico',vendorId:0x2e8a,productId:0x000a,serialNumber:'E66'};
  const picked=await new Promise(resolve=>{ses.emit('select-serial-port',{preventDefault(){}},[port],wc(),resolve);});
  assert.equal(picked,'p1','the chosen port goes back to the page');
  assert.equal(devices().has(new URL(base).origin,'serial',port),true,'the port is remembered for the site');
  assert.equal(devices().has('https://other.example','serial',port),false,'other sites do not get it');
  let info=await action('site-info');assert.deepEqual(info.devices.map(d=>[d.type,d.name]),[['serial','Pico']],'the site popover lists the device');
  const rows=await action('permissions-list');assert.ok(rows.some(r=>r.permission==='device'&&r.name==='Pico'),'Settings lists the device');
  await action('set-setting',{key:'deviceAccess',value:false});assert.equal(devices().has(new URL(base).origin,'serial',port),false,'turning device access off stops it');
  assert.equal(await wc().executeJavaScript('navigator.hid.getDevices().then(d=>d.length,()=>-1)'),0);
  await action('set-setting',{key:'deviceAccess',value:true});
  info=await action('device-remove',{origin:new URL(base).origin,key:info.devices[0].key});assert.equal(info.devices.length,0,'removing a device from the popover');

  // MIDI asks like camera and microphone, and shows up in the popover once asked.
  await wc().executeJavaScript('navigator.requestMIDIAccess().then(()=>"ok",e=>e.name)',true);
  info=await action('site-info');assert.ok(info.permissions.some(p=>p.permission==='midi'),'MIDI request recorded: '+JSON.stringify(info.permissions));

  // Screen sharing shows a chooser (macOS 15+ uses its own picker); cancelling ends the request.
  const boxes=[];dialog.showMessageBox=async(_w,options)=>{boxes.push(options);return {response:0};};
  const share=await wc().executeJavaScript('navigator.mediaDevices.getDisplayMedia({video:true}).then(()=>"shared",e=>e.name)',true);
  assert.ok(boxes.some(b=>/share your screen/.test(b.message)),'screen share chooser: '+JSON.stringify(boxes.map(b=>b.message)));assert.notEqual(share,'shared');
  dialog.showMessageBox=realBox;

  // Save Page As writes the page with its files.
  const out=path.join(app.getPath('userData'),'saved-page','Device lab.html');dialog.showSaveDialog=async()=>({canceled:false,filePath:out});
  const saved=await action('save-page');assert.ok(!saved?.error,JSON.stringify(saved));assert.match(fs.readFileSync(out,'utf8'),/Plain page/,'saved page has the content');
  dialog.showSaveDialog=realSave;

  // HTTP sign-in: a sheet asks for the user name and password, and the page loads after signing in.
  const before=new Set(BrowserWindow.getAllWindows());wc().loadURL(base+'/private').catch(()=>{});
  let sheet;await eventually(()=>{sheet=BrowserWindow.getAllWindows().find(w=>!before.has(w)&&w.getParentWindow()===win);return sheet&&!sheet.webContents.isLoading();},'sign-in sheet opens');
  assert.match(await sheet.webContents.executeJavaScript('document.body.innerText'),/Sign in to localhost:\d+[\s\S]*Staging/,'sheet names the site and realm');
  await sheet.webContents.executeJavaScript("document.forms[0].u.value='ada';document.forms[0].p.value='lovelace';document.forms[0].requestSubmit();true");
  await eventually(()=>wc().getTitle()==='Signed in','page loads after signing in');assert.ok(sheet.isDestroyed(),'sheet closes');

  // Extensions: a no-popup extension gets its click (chrome.action.onClicked), and its right-click menu has its own items.
  const root=path.join(app.getPath('userData'),'extension-menu-fixtures');
  const ext=await services.installExtension(fixture(root,'clicker',{
   'manifest.json':{manifest_version:3,name:'Clicker',version:'1.0',permissions:['contextMenus','storage'],action:{default_title:'Clicker'},background:{service_worker:'sw.js'},options_page:'options.html'},
   'sw.js':"chrome.runtime.onInstalled.addListener(()=>chrome.contextMenus.create({id:'usage',title:'Show usage',contexts:['action']}));chrome.contextMenus.create({id:'usage2',title:'Show usage',contexts:['action']},()=>void chrome.runtime.lastError);chrome.action.onClicked.addListener(tab=>{chrome.tabs.create({url:chrome.runtime.getURL('options.html')});});",
   'options.html':'<title>Clicker options</title>'}),false);
  await eventually(()=>{const m=extensionMenuTemplate(ext.id)||[];return m.some(i=>i.label==='Show usage');},'extension action menu items appear');
  const menu=extensionMenuTemplate(ext.id).map(i=>i.label).filter(Boolean);
  for(const label of ['Clicker','Show usage','Options','Turn off','Manage extensions'])assert.ok(menu.includes(label),label+' in '+JSON.stringify(menu));
  const count=snapshot().tabs.length;await action('extension-action',{id:ext.id});
  await eventually(()=>snapshot().tabs.length>count,'chrome.action.onClicked ran for an extension without a popup');
  console.log('chromium features flow passed');
 }finally{dialog.showMessageBox=realBox;dialog.showSaveDialog=realSave;server.close();app.exit(0);}
};

// 0.44 diagnostic (smoke profile only): installs popular Chrome Web Store extensions, opens each one's popup the way
// the toolbar does, loads a real page, and records every error their background, popup and content scripts log,
// so broken Chrome APIs show up by name. Report and popup screenshots go to reports/extensions-audit/.
const fs=require('node:fs'),path=require('node:path');const {installExtension}=require('electron-chrome-web-store');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const IDS=(process.env.PRISM_AUDIT_IDS||['mgjneceglphcpbbfbhjplkpgfapebmdg','ddkjiahejlhfcafbddmgiahcphecmpfh','eimadpbcbfnmbkopoojfekhnkhdbieeh','nngceckbapebfimnlniiiahkandclblb','aapbdbdomjkkjkaonfhkkikfgjllcleb','kbfnbcaeplbcioakkpcpgfkobkghlhen','aeblfdkhhhdcdjpifhhbdiojplfjncoa','gebbhagfogifgggkldgodflihgfeippi','mnjggcdmjocbbbhaepdhchncahnbgone','dbepggeogbaibhgnhhndojpepiihcmeb','fmkadmapgofadopljbjfkapdkoienihi','knheggckgoiihginacbkhaalnibhilkk','pejdijmoenmkgeppbflobdenhhabjlaj'].join(',')).split(',');
exports.run=async({app,win,makeTab,selectTab,action,services,snapshot,extensionApi})=>{
 const {webContents,BrowserWindow}=require('electron');const out=path.resolve(__dirname,'../reports/extensions-audit');fs.mkdirSync(out,{recursive:true});
 const report=[],logs=[];const note=(where,level,message,source)=>{const m=String(message||'');const id=(String(source||'').match(/chrome-extension:\/\/([a-p]{32})/)||m.match(/chrome-extension:\/\/([a-p]{32})/)||[])[1]||'';logs.push({at:Date.now(),where,level,id,message:m.slice(0,400),source:String(source||'').slice(0,200)});};
 const watch=wc=>wc.on('console-message',(e,level,message,line,source)=>{const d=typeof e?.message==='string'?e:{level,message,sourceId:source};const lv=d.level;if(lv==='error'||lv==='warning'||lv===3||lv===2)note(wc.getURL().startsWith('chrome-extension://')?'extension-page':'page',lv,d.message,d.sourceId||wc.getURL());});
 for(const wc of webContents.getAllWebContents())watch(wc);app.on('web-contents-created',(_e,wc)=>watch(wc));
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});
  const tab=makeTab('https://en.wikipedia.org/wiki/Prism');selectTab(tab.id);const ses=tab.view.webContents.session;
  ses.serviceWorkers.on('console-message',(_e,d)=>{if(d.level==='error'||d.level==='warning'||d.level>=2)note('worker',d.level,d.message,d.sourceUrl||d.sourceId);});
  const folder=path.join(app.getPath('userData'),'store-extensions');
  for(const id of IDS){const row={id};report.push(row);const since=Date.now();
   try{await Promise.race([installExtension(id,{session:ses,extensionsPath:folder}),delay(45000).then(()=>{throw Error('install timed out');})]);}catch(error){row.installError=error.message;console.log('audit',id,'install failed',error.message);continue;}
   const ext=ses.extensions.getExtension(id);row.name=ext?.name;row.version=ext?.version;row.mv=ext?.manifest.manifest_version;row.permissions=ext?.manifest.permissions;
   row.inPrism=snapshot().extensions?.some(e=>e.id===id);await delay(2500);
   try{fs.copyFileSync(path.join(ext.path,'manifest.json'),path.join(out,id+'-manifest.json'));const sw=ext.manifest.background?.service_worker;if(sw&&process.env.PRISM_AUDIT_SOURCES){const dir=path.dirname(path.join(ext.path,sw));for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js')))fs.copyFileSync(path.join(dir,f),path.join(out,id+'-'+f));}}catch{}
   // Which extension content scripts run in the page: their isolated worlds show up as execution contexts.
   const twc=tab.view.webContents,contexts=[];try{twc.debugger.attach('1.3');twc.debugger.on('message',(_e,m,p)=>{if(m==='Runtime.executionContextCreated')contexts.push(p.context.origin+' '+(p.context.name||''));});await twc.debugger.sendCommand('Runtime.enable');}catch(error){row.debuggerError=error.message;}
   twc.reload();await delay(5000);row.contentWorlds=[...new Set(contexts.filter(c=>c.includes(id)))];try{twc.debugger.detach();}catch{}
   const before=new Set(BrowserWindow.getAllWindows());const result=await action('extension-action',{id}).catch(e=>({error:e.message}));row.action=result||null;await delay(4000);
   const popup=BrowserWindow.getAllWindows().find(w=>!before.has(w)&&w.webContents.getURL().startsWith('chrome-extension://'+id));
   if(popup){row.popup={url:popup.webContents.getURL(),bounds:popup.getBounds(),visible:popup.isVisible()};try{row.popup.text=(await popup.webContents.executeJavaScript('document.body?document.body.innerText.slice(0,300):""')).replace(/\s+/g,' ');fs.writeFileSync(path.join(out,id+'.png'),(await popup.webContents.capturePage()).toPNG());}catch(error){row.popup.error=error.message;}popup.close();}
   // Right-click items on an image and on the page, before and after the extension is unloaded and loaded again (a restart).
   const wc=tab.view.webContents,img=await wc.executeJavaScript('(()=>{const i=[...document.images].find(i=>i.naturalWidth>100);return i?i.currentSrc:"";})()').catch(()=>'');
   const params={mediaType:img?'image':'none',srcURL:img,pageURL:wc.getURL(),frameURL:wc.getURL(),linkURL:'',selectionText:'',isEditable:false,editFlags:{}};
   const labels=()=>{const walk=items=>items.flatMap(i=>[i.label,...walk(i.submenu||[])]);return walk(extensionApi().getContextMenuItems(wc,params)||[]).filter(Boolean);};
   row.menu=labels();const ext2=ses.extensions.getExtension(id);if(ext2){ses.extensions.removeExtension(id);await delay(500);await ses.extensions.loadExtension(ext2.path);await delay(3000);row.menuAfterRestart=labels();}
   const own=(extensionApi().getContextMenuItems(wc,params)||[]).flatMap(i=>[i,...(i.submenu||[])]).filter(i=>i.click);
   if(own.length){const tabsBefore=snapshot().tabs.length;own[own.length-1].click();await delay(5000);row.clicked=own[own.length-1].label;row.tabsAfterClick=snapshot().tabs.length-tabsBefore;try{fs.writeFileSync(path.join(out,id+'-page.png'),(await wc.capturePage()).toPNG());}catch{}}
   row.tabsAfter=snapshot().tabs.length;row.errors=logs.filter(l=>l.at>=since&&(l.id===id||!l.id)).map(({where,level,message,source})=>({where,level,message,source}));
   console.log('audit',id,row.name,'popup',!!popup,'errors',row.errors.length);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,1));}
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,1));fs.writeFileSync(path.join(out,'all-logs.json'),JSON.stringify(logs,null,1));console.log('extensions audit done');
 }finally{app.exit(0);}
};

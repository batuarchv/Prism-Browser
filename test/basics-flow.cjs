const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,action,snapshot,tabs})=>{
 const server=http.createServer((_req,res)=>{res.setHeader('Content-Type','text/html');res.end('<title>Essentials fixture</title><h1>Prism search</h1><p>Prism browser</p>');});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`;
 const tab=makeTab(url);await new Promise(r=>tab.view.webContents.once('did-stop-loading',r));await delay(200);
 await action('find',{query:'Prism'});await delay(250);assert.equal(snapshot().find.matches,2);assert.equal(tab.view.getBounds().y,94);const first=snapshot().find.active;await action('find',{query:'Prism',next:true});await delay(200);assert.notEqual(snapshot().find.active,first);
 await action('find-close');assert.equal(tab.view.getBounds().y,52);
 await win.webContents.executeJavaScript("openPanel('history')");await delay(150);assert.equal(await win.webContents.executeJavaScript("document.querySelector('#history-rows strong').textContent"),'Essentials fixture');
 await win.webContents.executeJavaScript("openPanel('permissions')");await delay(150);assert.match(await win.webContents.executeJavaScript("document.querySelector('#permissions-rows').textContent"),/No saved/);await win.webContents.executeJavaScript('closePanel()');
 await action('close',tab.id);await action('reopen');const restored=tabs.find(t=>t.id===snapshot().activeId);assert.equal(restored.url,url);assert.notEqual(restored.id,tab.id);
 await action('space','private');assert.deepEqual(await action('history-list'),[]);assert.deepEqual(await action('permissions-list'),[]);assert.match((await action('reopen')).message,/No closed/);
 await action('space','personal');await action('history-remove',url);assert.equal((await action('history-list')).some(x=>x.url===url),false);
 const report={passed:true,checks:['find matches and next match','native view bounds restored','history title and settings rendering','permissions settings rendering','reopen closed tab','Private history and recovery isolation','history removal'],electron:process.versions.electron};fs.writeFileSync(path.join(__dirname,'../reports/basics-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));server.close();app.exit(0);
};

// Development: opens Prism on the smoke profile with a colourful local page and stays open (PRISM_HANDS_ON_SECONDS,
// default 600) so popovers can be tried by hand. Nothing is checked.
const http=require('node:http');
exports.run=async({app,win,makeTab,selectTab})=>{
 const server=http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html'});r.end('<title>Example Studio</title><body style="font:15px system-ui;padding:40px;background:linear-gradient(135deg,#f6d365,#fda085 40%,#84fab0)"><h1>Example Studio</h1><p>Colourful page.</p><input placeholder="Type here"><button onclick="navigator.hid.requestDevice({filters:[]})">Connect a keyboard</button>'+('<p>Lorem ipsum dolor sit amet.</p>'.repeat(30))+'</body>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});
 const t=makeTab('http://localhost:'+server.address().port+'/');selectTab(t.id);win.show();win.focus();
 setTimeout(()=>{server.close();app.exit(0);},(Number(process.env.PRISM_HANDS_ON_SECONDS)||600)*1000);
};

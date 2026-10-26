// 0.38.1 (PRISM_TEST_FLOW=beam-flow.cjs): Beam opens, finds results as you type, and offers its assistant (Apple
// Intelligence here); asking it answers inside Beam. 0.38.0 failed on the first keystroke: Electron 44's main-process
// clipboard has no availableFormats, so every query threw and Beam stayed empty.
const assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,commandBar,win})=>{const {BrowserWindow}=require('electron');
 try{await win.webContents.executeJavaScript('typeof finishSetup==="function"&&finishSetup()');}catch{}
 await wait(800);await commandBar().open();await wait(1200);
 const w=BrowserWindow.getAllWindows().find(x=>x.webContents.getURL().includes('command-bar'));assert.ok(w?.isVisible(),'Beam is open');
 const rows=await w.webContents.executeJavaScript(`(async()=>{const i=document.getElementById('command-input');i.value='what is the capital of france';i.dispatchEvent(new Event('input'));await new Promise(r=>setTimeout(r,800));return [...document.querySelectorAll('.command-row strong')].map(x=>x.textContent)})()`);
 assert.ok(rows.length>=2,'results while typing: '+JSON.stringify(rows));assert.ok(rows.some(r=>r.startsWith('Ask ')),'assistant offered');
 const answer=await w.webContents.executeJavaScript(`(async()=>{const row=[...document.querySelectorAll('.command-row')].find(r=>r.textContent.includes('Ask '));row.click();for(let k=0;k<80;k++){await new Promise(r=>setTimeout(r,500));const el=document.getElementById('command-answer');if(el&&!el.hidden&&!el.classList.contains('thinking'))return el.textContent;}return ''})()`);
 assert.ok(answer.length>0,'an answer came back');console.log(JSON.stringify({rows:rows.slice(0,3),answer:answer.slice(0,120)}));
 if(process.env.PRISM_TEST_FLOW?.includes('beam-flow'))app.exit(0);};

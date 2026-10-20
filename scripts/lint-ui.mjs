import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkPage} from 'lintapple';
const require=createRequire(import.meta.url),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {_electron}=createRequire(require.resolve('lintapple'))('playwright');
const policy=JSON.parse(fs.readFileSync(path.join(root,'ui-policy.json')));
const browser=await _electron.launch({executablePath:require('electron'),args:[path.join(root,'test/ui-lint-entry.cjs')],cwd:root});
const runs=[];
async function settingsView(pane){for(let i=0;i<100;i++){const view=browser.windows().find(w=>w.url().includes('tool=panel'));if(view&&await view.evaluate(p=>typeof panel!=='undefined'&&panel===p&&!document.querySelector('#preferences').hidden,pane).catch(()=>false)){await view.waitForTimeout(300);return view;}await new Promise(r=>setTimeout(r,100));}throw Error('Settings view did not open: '+pane);}
try{
 const page=await browser.firstWindow();await page.waitForFunction(()=>typeof openPanel==='function'&&typeof state!=='undefined'&&state);
 // Let first-run setup finish selecting its tab; a tab switch closes tool views.
 await page.waitForTimeout(3000);
 for(const viewport of policy.viewports){
  await browser.evaluate(({BrowserWindow},size)=>BrowserWindow.getAllWindows()[0].setContentSize(size.width,size.height),viewport);
  runs.push({viewport,pane:'browser',...await checkPage(page,policy)});
  // Settings renders in its own tool view; audit that view rather than the browser window behind it.
  for(const pane of ['appearance','design','downloads','passwords','accessibility','performance']){
   await page.evaluate(p=>openPanel(p),pane);
   const settings=await settingsView(pane);
   runs.push({viewport,pane,...await checkPage(settings,policy)});
  }
 }
 const findings=runs.reduce((n,r)=>n+r.findings.length,0);
 fs.mkdirSync(path.join(root,'reports'),{recursive:true});
 fs.writeFileSync(path.join(root,'reports/ui-lint.json'),JSON.stringify({tool:'lintapple',findings,runs},null,2));
 console.log(`Lintapple: ${findings} findings across ${runs.length} interface checks. Report: reports/ui-lint.json`);
 if(findings)process.exitCode=1;
}finally{await browser.close();}

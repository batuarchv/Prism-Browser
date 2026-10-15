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
try{
 const page=await browser.firstWindow();await page.waitForFunction(()=>typeof openPanel==='function'&&typeof state!=='undefined'&&state);
 for(const viewport of policy.viewports){
  await browser.evaluate(({BrowserWindow},size)=>BrowserWindow.getAllWindows()[0].setContentSize(size.width,size.height),viewport);
  for(const pane of ['appearance','design','downloads']){
   await page.evaluate(p=>openPanel(p),pane);
   runs.push({viewport,pane,...await checkPage(page,policy)});
  }
 }
 const findings=runs.reduce((n,r)=>n+r.findings.length,0);
 fs.mkdirSync(path.join(root,'reports'),{recursive:true});
 fs.writeFileSync(path.join(root,'reports/ui-lint.json'),JSON.stringify({tool:'lintapple',findings,runs},null,2));
 console.log(`Lintapple: ${findings} findings across ${runs.length} interface checks. Report: reports/ui-lint.json`);
 if(findings)process.exitCode=1;
}finally{await browser.close();}

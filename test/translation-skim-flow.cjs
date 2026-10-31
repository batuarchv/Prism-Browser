// Development check (smoke profile only): lists interface text that stays English in another language.
// PRISM_TEST_FLOW=translation-skim-flow.cjs PRISM_SKIM_LANGUAGE=tr electron . --smoke-test
const fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const collect=`(()=>{const {catalog}=PrismLanguages;const out=new Set();const ex='script,style,[translate=no],.tab-title,.bookmark-title,.monogram,#history-rows,#credential-rows,#picker-rows,#download-list,#extension-list';
const ok=t=>{t=t.trim().replace(/\\s+/g,' ');return !t||!/[A-Za-z]{2}/.test(t)||catalog[t]||/^(Prism|Arc|Chrome|Safari|GitHub|YouTube|Wikipedia|Gmail|Claude|OpenAI|Apple Intelligence|Touch ID|English|Türkçe|Español|Português|Français|Українська)$/.test(t)||/^https?:|\\.\\w{2,4}$|^⌘/.test(t);};
const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const el=n.parentElement;if(!el||el.closest(ex))continue;if(!ok(n.nodeValue))out.add(n.nodeValue.trim().replace(/\\s+/g,' '));}
for(const el of document.querySelectorAll('[title],[aria-label],[placeholder]')){if(el.closest(ex))continue;for(const a of ['title','aria-label','placeholder']){const v=el.getAttribute(a);if(v&&!ok(v))out.add('@'+a+': '+v.trim());}}
return [...out];})()`;
exports.run=async({app,win,action,toolWindows})=>{
 const lang=process.env.PRISM_SKIM_LANGUAGE||'tr',report={};
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});}catch{}
 await action('set-setting',{key:'language',value:lang});await delay(800);
 report.window=await win.webContents.executeJavaScript(collect);
 for(const section of ['appearance','passwords','quick-downloads','quick-extensions','quick-site','quick-spaces','ai','updates','profile','blocking','workspace','design']){
  try{await win.webContents.executeJavaScript(`openPanel(${JSON.stringify(section)})`);await delay(900);const view=toolWindows.get();
   if(view&&!view.webContents.isDestroyed())report[section]=await view.webContents.executeJavaScript(collect);
   await win.webContents.executeJavaScript('closePanel()');await delay(300);}catch(error){report[section]=['ERROR '+error.message];}
 }
 const all=new Set(Object.values(report).flat());
 fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../reports/translation-skim-'+lang+'.json'),JSON.stringify({language:lang,unique:[...all].sort(),bySurface:report},null,1));
 console.log('SKIM '+lang+': '+all.size+' untranslated strings');app.exit(0);
};

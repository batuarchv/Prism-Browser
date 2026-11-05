// Built on demand; no page script, polling loop, or persistent menu per tab.
function webURL(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
function pageMenu({wc,params:p,clipboard,openTab,bookmark,inspect,pip,translate,peek,passwords,extensions=[]}){
 const items=[],flags=p.editFlags||{},alive=fn=>()=>{if(!wc.isDestroyed())fn();};
 const addGroup=rows=>{if(!rows.length)return;if(items.length)items.push({type:'separator'});items.push(...rows);};
 const command=(label,method,enabled=true)=>({label,enabled,click:alive(()=>{wc.focus();wc[method]();})});
 const link=webURL(p.linkURL),image=webURL(p.srcURL),saveAs=url=>alive(()=>{require('./save-as.cjs').askNext(url);wc.downloadURL(url);});
 if(p.linkURL)addGroup([...(link?[{label:'Open Link in Background Tab',click:()=>openTab(link,false)},{label:'Open Link in New Tab',click:()=>openTab(link)},...(peek?[{label:'Open Link in Lens',click:()=>peek(link)}]:[]),{label:'Save Link As…',click:saveAs(link)}]:[]),{label:'Copy Link Address',click:()=>{const link=String(p.linkURL);let clean=link;try{clean=require('./blocker.cjs').cleanLink(link)||link;}catch{}clipboard.writeText(clean);}}]);
 if(p.mediaType==='image')addGroup([
  ...(p.hasImageContents?[{label:'Copy Image',click:alive(()=>wc.copyImageAt(p.x,p.y))}]:[]),
  ...(image?[{label:'Open Image in New Tab',click:()=>openTab(image)},{label:'Save Image As…',click:saveAs(image)},{label:'Copy Image Address',click:()=>clipboard.writeText(image)},{label:'Search Image with Google',click:()=>openTab('https://lens.google.com/uploadbyurl?url='+encodeURIComponent(image))}]:[])
 ]);
 if(['video','audio'].includes(p.mediaType)&&image)addGroup([{label:'Open Media in New Tab',click:()=>openTab(image)},{label:'Save Media As…',click:saveAs(image)},{label:'Copy Media Address',click:()=>clipboard.writeText(image)}]);
 if(p.isEditable){
  const suggestions=p.inputFieldType==='password'?[]:(p.dictionarySuggestions||[]).slice(0,5);
  if(p.misspelledWord&&suggestions.length)addGroup(suggestions.map(word=>({label:word,click:alive(()=>wc.replaceMisspelling(word))})));
  // 0.50: sign-in fields get Fill Password (saved accounts for this site by name) and a strong password suggestion.
  const field=p.inputFieldType==='password'||/^input-(text|email|password|search)?$/.test(String(p.formControlType||''))||p.formControlType==='input-email';
  if(passwords&&field){const accounts=passwords.accounts()||[];addGroup([{label:'Fill Password',submenu:[...(accounts.length?accounts.map(a=>({label:a.username||'Saved account',click:()=>passwords.fill(a)})):[{label:'No Saved Passwords for This Site',enabled:false}]),{type:'separator'},...(p.inputFieldType==='password'?[{label:'Suggest Strong Password',click:alive(()=>{wc.focus();wc.insertText(strongPassword());})}]:[]),{label:'Passwords…',click:passwords.open}]}]);}
  addGroup([command('Undo','undo',!!flags.canUndo),command('Redo','redo',!!flags.canRedo)]);
  addGroup([command('Cut','cut',!!flags.canCut),command('Copy','copy',!!flags.canCopy),command('Paste','paste',!!flags.canPaste),command('Paste and Match Style','pasteAndMatchStyle',!!flags.canPaste),command('Select All','selectAll',!!flags.canSelectAll)]);
 }else if(p.selectionText?.trim())addGroup([command('Copy','copy',!!flags.canCopy)]);
 const selected=String(p.selectionText||'').trim().slice(0,2000);
 if(selected&&p.inputFieldType!=='password')addGroup([...(process.platform==='darwin'&&selected.length<=60?[{label:'Look Up “'+selected.slice(0,45)+(selected.length>45?'…':'')+'”',click:alive(()=>wc.showDefinitionForSelection())}]:[]),{label:'Search Google for “'+selected.slice(0,45)+(selected.length>45?'…':'')+'”',click:()=>openTab('https://www.google.com/search?q='+encodeURIComponent(selected))}]);
 if(selected&&!p.isEditable&&p.inputFieldType!=='password'&&translate)addGroup([{label:'Translate Selected Text…',click:translate}]);
 if(!p.isEditable)addGroup([{label:'Back',enabled:wc.navigationHistory.canGoBack(),click:alive(()=>wc.navigationHistory.goBack())},{label:'Forward',enabled:wc.navigationHistory.canGoForward(),click:alive(()=>wc.navigationHistory.goForward())},command('Reload','reload'),...(bookmark?[{label:'Bookmark This Page',click:bookmark}]:[])]);
 if(p.mediaType==='video'&&pip)addGroup([{label:'Picture in Picture',click:pip}]);
 if(inspect)addGroup([{label:'Inspect Element',click:inspect}]);
 addGroup(extensions);return items;
}
// Apple-style: three groups of six letters and digits, joined by dashes, from the system's secure random source.
function strongPassword(random=require('node:crypto').randomInt){const a='abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';const group=()=>Array.from({length:6},()=>a[random(a.length)]).join('');return [group(),group(),group()].join('-');}
module.exports={pageMenu,webURL,strongPassword};

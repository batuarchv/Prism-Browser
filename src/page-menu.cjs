// Built on demand; no page script, polling loop, or persistent menu per tab.
function webURL(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
function pageMenu({wc,params:p,clipboard,openTab,bookmark,inspect,pip,translate,peek,extensions=[]}){
 const items=[],flags=p.editFlags||{},alive=fn=>()=>{if(!wc.isDestroyed())fn();};
 const addGroup=rows=>{if(!rows.length)return;if(items.length)items.push({type:'separator'});items.push(...rows);};
 const command=(label,method,enabled=true)=>({label,enabled,click:alive(()=>{wc.focus();wc[method]();})});
 const link=webURL(p.linkURL),image=webURL(p.srcURL);
 if(p.linkURL)addGroup([...(link?[...(peek?[{label:'Open Link in Peek',click:()=>peek(link)}]:[]),{label:'Open Link in New Tab',click:()=>openTab(link)},{label:'Open Link in Background Tab',click:()=>openTab(link,false)},{label:'Save Link As…',click:alive(()=>wc.downloadURL(link))}]:[]),{label:'Copy Link Address',click:()=>clipboard.writeText(String(p.linkURL))}]);
 if(p.mediaType==='image')addGroup([
  ...(p.hasImageContents?[{label:'Copy Image',click:alive(()=>wc.copyImageAt(p.x,p.y))}]:[]),
  ...(image?[{label:'Open Image in New Tab',click:()=>openTab(image)},{label:'Save Image As…',click:alive(()=>wc.downloadURL(image))},{label:'Copy Image Address',click:()=>clipboard.writeText(image)},{label:'Search Image with Google',click:()=>openTab('https://lens.google.com/uploadbyurl?url='+encodeURIComponent(image))}]:[])
 ]);
 if(['video','audio'].includes(p.mediaType)&&image)addGroup([{label:'Open Media in New Tab',click:()=>openTab(image)},{label:'Save Media As…',click:alive(()=>wc.downloadURL(image))},{label:'Copy Media Address',click:()=>clipboard.writeText(image)}]);
 if(p.isEditable){
  const suggestions=p.inputFieldType==='password'?[]:(p.dictionarySuggestions||[]).slice(0,5);
  if(p.misspelledWord&&suggestions.length)addGroup(suggestions.map(word=>({label:word,click:alive(()=>wc.replaceMisspelling(word))})));
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
module.exports={pageMenu,webURL};

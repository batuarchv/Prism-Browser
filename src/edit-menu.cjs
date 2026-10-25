// Right-click editing in Prism's own windows (0.37): the sidebar and address field, Settings and popovers, Beam and
// Lens. Text fields get spelling suggestions, Undo, Cut, Copy, Paste, Paste and Match Style and Select All; selected
// text elsewhere gets Copy. Web pages keep their own, fuller menu (page-menu.cjs).
function editItems(params,{translate=t=>t,replace}={}){
 const f=params.editFlags||{},items=[];
 if(params.isEditable&&params.misspelledWord){for(const word of (params.dictionarySuggestions||[]).slice(0,4))items.push({label:word,click:()=>replace(word)});if(items.length)items.push({type:'separator'});}
 if(params.isEditable){items.push({label:translate('Undo'),role:'undo',enabled:!!f.canUndo},{label:translate('Redo'),role:'redo',enabled:!!f.canRedo},{type:'separator'},
  {label:translate('Cut'),role:'cut',enabled:!!f.canCut},{label:translate('Copy'),role:'copy',enabled:!!f.canCopy},{label:translate('Paste'),role:'paste',enabled:!!f.canPaste},
  {label:translate('Paste and Match Style'),role:'pasteAndMatchStyle',enabled:!!f.canPaste},{type:'separator'},{label:translate('Select All'),role:'selectAll',enabled:!!f.canSelectAll});}
 else if(String(params.selectionText||'').trim())items.push({label:translate('Copy'),role:'copy'});
 return items;
}
function attachEditMenu(wc,{Menu,window,translate,extra=()=>[]}){
 wc.on('context-menu',(_event,params)=>{const items=[...extra(params),...editItems(params,{translate,replace:word=>wc.replaceMisspelling(word)})];
  while(items[0]?.type==='separator')items.shift();if(!items.length)return;const owner=window();Menu.buildFromTemplate(items).popup(owner&&!owner.isDestroyed()?{window:owner}:{});});
}
module.exports={attachEditMenu,editItems};

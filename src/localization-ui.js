(() => {
 const {catalog,languages,translate}=PrismLanguages;
 let language='en';
 const textRecords=new WeakMap(),attributeRecords=new WeakMap();
 // Never interpret page titles, saved names, filenames, extension names, or form values as UI labels.
 const excluded='script,style,[translate=no],#download-activity small,#wallet-rows strong,#wallet-rows small,.suggestion-text strong,#blocker-site-status,#blocker-exceptions,.tab-title,.bookmark-title,.monogram,#bookmarks summary,#folder-options,#extension-list h3,#download-list h3,#history-rows strong,#history-rows article p,#permissions-rows strong,#permissions-rows article p,#credential-rows strong,#credential-rows article>p,#picker-rows,#picker-origin';
 function skip(el){return !el||!!el.closest(excluded);}
 function text(node){if(skip(node.parentElement))return;const raw=node.nodeValue;if(!raw?.trim())return;let record=textRecords.get(node);if(!record||raw!==record.output){const key=raw.trim();if(!catalog[key])return;record={key,prefix:raw.match(/^\s*/)[0],suffix:raw.match(/\s*$/)[0]};textRecords.set(node,record);}record.output=record.prefix+translate(language,record.key)+record.suffix;if(raw!==record.output)node.nodeValue=record.output;}
 function attributes(el){if(skip(el)||el.matches('.favorite,.home-favorite,.bookmark,.tab-main,.tab-close')||el.closest('#extension-list,#download-list'))return;let records=attributeRecords.get(el);if(!records){records={};attributeRecords.set(el,records);}for(const attr of ['title','aria-label','placeholder']){const raw=el.getAttribute(attr);if(!raw)continue;let record=records[attr];if(!record||record.output!==raw){if(!catalog[raw])continue;record=records[attr]={key:raw};}record.output=translate(language,record.key);if(raw!==record.output)el.setAttribute(attr,record.output);}}
 function scan(root){if(root.nodeType===Node.TEXT_NODE){text(root);return;}if(root.nodeType!==Node.ELEMENT_NODE||skip(root))return;attributes(root);const walk=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let node;while(node=walk.nextNode()){if(node.nodeType===Node.TEXT_NODE)text(node);else attributes(node);}}
 function setLanguage(next){next=languages.includes(next)?next:'en';if(language===next)return;language=next;document.documentElement.lang=language;scan(document.body);}
 window.prismLocale={setLanguage,t:key=>translate(language,key)};
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='childList')for(const n of r.addedNodes)scan(n);else if(r.type==='characterData')text(r.target);else attributes(r.target);}});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']});
 setLanguage(state?.settings?.language||'en');
})();

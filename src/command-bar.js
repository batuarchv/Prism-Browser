// Command bar page (command-bar.cjs): a field and a ranked list. ↑ ↓ choose, Return runs, ⌥Return opens a page in
// the current tab instead of a new one, Esc closes. Results come from the browser as you type.
(()=>{const $=id=>document.getElementById(id),input=$('command-input'),list=$('command-list');let items=[],index=0,request=0,language='en';
 $('command-glyph').append(icon('search'));
 const t=key=>globalThis.PrismLanguages?PrismLanguages.translate(language,key):key;
 const HINT={suggest:'Search',go:'Open',tab:'Switch to tab',favorite:'Favorite',bookmark:'Bookmark',history:'History',archive:'Archived',action:'Action'};
 function fit(){requestAnimationFrame(()=>surface.send('size',{height:Math.ceil(document.body.scrollHeight)}));}
 function select(i){index=Math.max(0,Math.min(items.length-1,i));[...list.children].forEach((row,n)=>row.setAttribute('aria-selected',String(n===index)));list.children[index]?.scrollIntoView({block:'nearest'});input.setAttribute('aria-activedescendant','command-'+index);}
 function glyph(item){if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='';img.onerror=()=>img.replaceWith(glyphFallback(item));return img;}return glyphFallback(item);}
 function glyphFallback(item){if(item.icon)return icon(item.icon);const span=document.createElement('span');span.className='monogram';try{span.textContent=new URL(item.detail).hostname.replace(/^www\./,'')[0].toUpperCase();}catch{span.textContent=(item.title||'·')[0].toUpperCase();}return span;}
 function draw(next){items=next||[];list.replaceChildren(...items.map((item,i)=>{const row=document.createElement('div');row.className='command-row';row.id='command-'+i;row.setAttribute('role','option');
   const badge=document.createElement('span');badge.className='command-icon';badge.append(glyph(item));const text=document.createElement('span');text.className='command-text';const title=document.createElement('strong');title.textContent=item.kind==='action'||item.kind==='go'?t(item.title):item.title;if(item.kind==='suggest'){const typed=input.value.trim().toLowerCase();if(typed&&item.title.toLowerCase().startsWith(typed)){const lead=document.createElement('span');lead.className='typed';lead.textContent=item.title.slice(0,typed.length);title.replaceChildren(lead,document.createTextNode(item.title.slice(typed.length)));}}text.append(title);
   if(item.detail&&item.kind!=='action'){const small=document.createElement('small');small.textContent=item.detail.replace(/^https?:\/\/(www\.)?/,'');text.append(small);}
   const hint=document.createElement('span');hint.className='command-hint';hint.textContent=t(item.hint||HINT[item.kind]||'');
   row.append(badge,text,hint);row.onpointermove=()=>{if(index!==i)select(i);};row.onclick=e=>run(i,e.altKey);return row;}));
  list.hidden=!items.length;document.body.classList.toggle('has-results',!!items.length);select(0);fit();}
 // Return pressed while the results for the last keystroke are still on their way runs the result for what was typed,
 // not the list for the shorter text before it (0.44).
 let pending=null;async function query(){const gen=++request,q=input.value;const ask=surface.ask('query',q);pending=ask;const rows=await ask;if(pending===ask)pending=null;if(gen!==request)return;draw(rows);suggest(gen,q);}
 // Google's suggestions (0.39) join under the top results once they arrive, without moving what you have selected.
 let suggestTimer;function suggest(gen,q){clearTimeout(suggestTimer);if(q.trim().length<2)return;suggestTimer=setTimeout(async()=>{const rows=await surface.ask('suggest',q).catch(()=>null);if(gen!==request||!rows?.length)return;
  const typed=q.trim().toLowerCase(),have=new Set(items.map(i=>String(i.title).toLowerCase())),extra=rows.filter(r=>r.title.toLowerCase()!==typed&&!have.has(r.title.toLowerCase())).slice(0,5);if(!extra.length)return;
  const chosen=items[index]?.id,lead=i=>i.completion||i.kind==='go'||i.kind==='ai',head=items.filter(lead),rest=items.filter(i=>!lead(i));draw([...head,...rest.slice(0,3),...extra,...rest.slice(3,6)]);const keep=items.findIndex(i=>i.id===chosen);if(keep>0)select(keep);},80);}
 // Ask Claude or Apple Intelligence (0.37/0.38): Beam stays open while the assistant either runs the right item (Beam then closes) or answers here.
 const answer=$('command-answer');let asking=0;
 async function ask(){const gen=++asking,q=input.value;answer.hidden=false;answer.classList.add('thinking');answer.textContent=t('Thinking…');fit();
  const result=await surface.ask('ai',q).catch(()=>null);if(gen!==asking)return;answer.classList.remove('thinking');
  if(result?.ran){answer.hidden=true;surface.send('close');return;}answer.textContent=result?.answer||t('No answer came back.');fit();}
 function run(i,alt){const item=items[i];if(!item)return;if(item.kind==='ai'){ask();return;}surface.send('run',{id:item.id,query:input.value,alt});}
 // Paste an image into Beam to search with it (Google Lens).
 input.addEventListener('paste',async e=>{const item=[...(e.clipboardData?.items||[])].find(x=>x.kind==='file'&&x.type.startsWith('image/'));if(!item)return;e.preventDefault();const file=item.getAsFile();if(file)surface.send('image',new Uint8Array(await file.arrayBuffer()));});
 input.addEventListener('input',()=>{asking++;answer.hidden=true;query();});
 input.addEventListener('keydown',e=>{if(e.isComposing)return;if(e.key==='ArrowDown'){e.preventDefault();select(index+1);}else if(e.key==='ArrowUp'){e.preventDefault();select(index-1);}else if(e.key==='Enter'){e.preventDefault();const alt=e.altKey;if(pending)pending.then(()=>setTimeout(()=>run(index,alt))).catch(()=>run(index,alt));else run(index,alt);}else if(e.key==='Escape'){e.preventDefault();surface.send('close');}});
 $('command-form').onsubmit=e=>e.preventDefault();
 surface.on(s=>{if(s.type==='reset'){input.value='';list.replaceChildren();items=[];asking++;answer.hidden=true;return;}if(s.type!=='open')return;language=s.language||'en';applySurfaceTheme(s);input.placeholder=t('Search, type an address, ask, or paste an image');input.value=s.query||'';document.body.classList.remove('enter');void document.body.offsetWidth;document.body.classList.add('enter');input.focus();input.select();query();});
})();
// 0.47: the selected row's highlight glides between rows on a spring (hitbox.js).
window.PrismHitbox?.attach(document.getElementById('command-list'),'.command-row',{mode:'selected'});

// Command bar page (command-bar.cjs): a field and a ranked list. ↑ ↓ choose, Return runs, ⌥Return opens a page in
// the current tab instead of a new one, Esc closes. Results come from the browser as you type.
(()=>{const $=id=>document.getElementById(id),input=$('command-input'),list=$('command-list');let items=[],index=0,request=0,language='en';
 $('command-glyph').append(icon('search'));
 const t=key=>globalThis.PrismLanguages?PrismLanguages.translate(language,key):key;
 const HINT={go:'Open',tab:'Switch to tab',favorite:'Favorite',bookmark:'Bookmark',history:'History',archive:'Archived',action:'Action'};
 function fit(){requestAnimationFrame(()=>surface.send('size',{height:Math.ceil(document.body.scrollHeight)}));}
 function select(i){index=Math.max(0,Math.min(items.length-1,i));[...list.children].forEach((row,n)=>row.setAttribute('aria-selected',String(n===index)));list.children[index]?.scrollIntoView({block:'nearest'});input.setAttribute('aria-activedescendant','command-'+index);}
 function glyph(item){if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='';img.onerror=()=>img.replaceWith(glyphFallback(item));return img;}return glyphFallback(item);}
 function glyphFallback(item){if(item.icon)return icon(item.icon);const span=document.createElement('span');span.className='monogram';try{span.textContent=new URL(item.detail).hostname.replace(/^www\./,'')[0].toUpperCase();}catch{span.textContent=(item.title||'·')[0].toUpperCase();}return span;}
 function draw(next){items=next||[];list.replaceChildren(...items.map((item,i)=>{const row=document.createElement('div');row.className='command-row';row.id='command-'+i;row.setAttribute('role','option');
   const badge=document.createElement('span');badge.className='command-icon';badge.append(glyph(item));const text=document.createElement('span');text.className='command-text';const title=document.createElement('strong');title.textContent=item.kind==='action'||item.kind==='go'?t(item.title):item.title;text.append(title);
   if(item.detail&&item.kind!=='action'){const small=document.createElement('small');small.textContent=item.detail.replace(/^https?:\/\/(www\.)?/,'');text.append(small);}
   const hint=document.createElement('span');hint.className='command-hint';hint.textContent=t(item.hint||HINT[item.kind]||'');
   row.append(badge,text,hint);row.onpointermove=()=>{if(index!==i)select(i);};row.onclick=e=>run(i,e.altKey);return row;}));
  list.hidden=!items.length;document.body.classList.toggle('has-results',!!items.length);select(0);fit();}
 async function query(){const gen=++request;const rows=await surface.ask('query',input.value);if(gen===request)draw(rows);}
 function run(i,alt){const item=items[i];if(item)surface.send('run',{id:item.id,query:input.value,alt});}
 input.addEventListener('input',query);
 input.addEventListener('keydown',e=>{if(e.isComposing)return;if(e.key==='ArrowDown'){e.preventDefault();select(index+1);}else if(e.key==='ArrowUp'){e.preventDefault();select(index-1);}else if(e.key==='Enter'){e.preventDefault();run(index,e.altKey);}else if(e.key==='Escape'){e.preventDefault();surface.send('close');}});
 $('command-form').onsubmit=e=>e.preventDefault();
 surface.on(s=>{if(s.type==='reset'){input.value='';list.replaceChildren();items=[];return;}if(s.type!=='open')return;language=s.language||'en';applySurfaceTheme(s);input.placeholder=t('Search tabs, bookmarks, history or actions');input.value=s.query||'';document.body.classList.remove('enter');void document.body.offsetWidth;document.body.classList.add('enter');input.focus();input.select();query();});
})();

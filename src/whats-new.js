// "What's New" after an update: the glass logo turns in (the update sequence), then the release items rise in.
// Data comes from main.cjs in the query string: {version, date, items:[{icon,title,detail}], language, dark, reduceMotion}.
(()=>{
 let data={};try{data=JSON.parse(new URLSearchParams(location.search).get('data')||'{}');}catch{}
 const root=document.documentElement,lang=data.language||'en',t=text=>globalThis.PrismLanguages?.translate(lang,text)||text;
 root.dataset.theme=data.dark?'dark':'light';if(data.reduceMotion)root.dataset.motion='reduced';root.lang=lang;
 const mark=document.getElementById('wn-mark');mark.src=`../assets/prism-glass${data.dark?'-dark':''}.png`;
 document.getElementById('wn-title').textContent=t('What’s New');document.title=t('What’s New');
 const date=data.date?new Date(data.date+'T12:00:00').toLocaleDateString(lang,{day:'numeric',month:'long',year:'numeric'}):'';
 document.getElementById('wn-version').textContent=['Prism '+(data.version||''),date].filter(Boolean).join(' · ');
 const list=document.getElementById('wn-items');
 for(const [i,item] of (Array.isArray(data.items)?data.items:[]).entries()){const li=document.createElement('li');li.style.setProperty('--i',i);
  const glyph=document.createElement('span');glyph.className='wn-icon';glyph.append(icon(String(item.icon||'sparkles')));
  const text=document.createElement('div');const title=document.createElement('strong');title.textContent=String(item.title||'');text.append(title);if(item.detail){const detail=document.createElement('small');detail.textContent=String(item.detail);text.append(detail);}
  li.append(glyph,text);list.append(li);}
 const notes=document.getElementById('wn-notes');notes.textContent=t(data.more?'See everything new':'Release notes');
 const button=document.getElementById('wn-continue');button.textContent=t('Continue');button.onclick=()=>window.close();button.focus({focusVisible:false});
 addEventListener('keydown',e=>{if(e.key==='Escape')window.close();});
 // The sequence: logo first, then text. Reduce Motion shows everything at once.
 const reduced=data.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&globalThis.PrismGlass?.upgrade(mark,{intro:true,spin:.18,place:'whats-new'})){root.classList.add('sequence');setTimeout(()=>root.classList.add('revealed'),900);}
 else root.classList.add('revealed');
})();

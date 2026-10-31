// Reader page (reader.cjs): draws the article tree with DOM calls only (no HTML parsing), and sends the reader's
// choices back. Links never navigate this page: they open in the tab, or in a new tab with ⌘.
(()=>{const $=id=>document.getElementById(id),root=document.documentElement;let prefs={font:'newyork',size:19,theme:'auto',width:'normal'},dark=false,language='en',current=null;
 const t=key=>globalThis.PrismLanguages?PrismLanguages.translate(language,key):key;
 const TAGS=new Set(['p','h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','pre','code','em','i','strong','b','u','s','sub','sup','small','mark','br','hr','a','img','figure','figcaption','table','thead','tbody','tr','td','th','caption','dl','dt','dd','q','cite','time','abbr','kbd','var','samp','del','ins']);
 function build(node,depth=0){if(typeof node==='string')return document.createTextNode(node);if(!Array.isArray(node)||depth>60||!TAGS.has(node[0]))return document.createTextNode('');
  const [tag,attrs={},...kids]=node,el=document.createElement(tag);
  if(tag==='a'&&/^(https?:|mailto:)/.test(attrs.href||'')){el.href=attrs.href;el.rel='noreferrer';}
  if(tag==='img'&&/^https?:\/\//.test(attrs.src||'')){el.src=attrs.src;el.alt=String(attrs.alt||'');el.loading='lazy';el.decoding='async';el.referrerPolicy='no-referrer';el.onerror=()=>el.remove();}
  if(tag==='ol'&&attrs.start)el.start=+attrs.start||1;if((tag==='td'||tag==='th')&&attrs.colspan)el.colSpan=+attrs.colspan||1;
  for(const k of kids)el.append(build(k,depth+1));return el;}
 function when(value){const d=new Date(value);return isNaN(d)?'':d.toLocaleDateString(language,{year:'numeric',month:'long',day:'numeric'});}
 function render(article){current=article;document.title=article.title||t('Reader');root.lang=article.lang||'';root.dir=article.dir||'ltr';
  $('reader-site').textContent=article.site||'';$('reader-title').textContent=article.title||'';
  const meta=[article.byline,when(article.published),t('{n} min read').replace('{n}',article.minutes||1)].filter(Boolean);$('reader-meta').textContent=meta.join(' · ');
  const body=$('reader-body');body.replaceChildren();if(article.lead){const img=build(['img',{src:article.lead,alt:''}]);body.append(img);}
  for(const node of article.tree||[])body.append(build(node));$('reader-scroll').scrollTop=0;
  const art=$('reader-article');art.style.animation='none';void art.offsetWidth;art.style.animation='';
  document.body.classList.add('bar');clearTimeout(render.timer);render.timer=setTimeout(()=>document.body.classList.remove('bar'),1800);}
 function apply(){const theme=prefs.theme==='auto'?(dark?'dark':'light'):prefs.theme;root.dataset.reader=theme;root.dataset.font=prefs.font;root.dataset.width=prefs.width;root.style.setProperty('--size',prefs.size+'px');
  for(const b of document.querySelectorAll('[data-pref]'))b.setAttribute('aria-pressed',String(prefs[b.dataset.pref]===b.dataset.value));}
 function set(key,value){prefs={...prefs,[key]:value};apply();surface.send('prefs',prefs);}
 // Appearance menu: themes, faces (each shown in its own face), line width.
 const themes=[['auto','Auto'],['light','White'],['sepia','Sepia'],['gray','Gray'],['dark','Night']],fonts=[['newyork','New York','"New York",ui-serif,Georgia,serif'],['system','San Francisco','-apple-system,system-ui,sans-serif'],['charter','Charter','Charter,Georgia,serif'],['iowan','Iowan','"Iowan Old Style",Palatino,serif']],widths=[['narrow','Narrow'],['normal','Normal'],['wide','Wide']];
 function menu(){$('reader-themes').replaceChildren(...themes.map(([v,label])=>{const b=document.createElement('button');b.className='swatch '+v;b.dataset.pref='theme';b.dataset.value=v;b.title=t(label);b.setAttribute('aria-label',t(label));b.onclick=()=>set('theme',v);return b;}));
  $('reader-fonts').replaceChildren(...fonts.map(([v,label,face])=>{const b=document.createElement('button');b.className='font';b.dataset.pref='font';b.dataset.value=v;b.textContent=label;b.style.fontFamily=face;b.onclick=()=>set('font',v);return b;}));
  $('reader-widths').replaceChildren(...widths.map(([v,label])=>{const b=document.createElement('button');b.className='width';b.dataset.pref='width';b.dataset.value=v;b.textContent=t(label);b.onclick=()=>set('width',v);return b;}));apply();}
 const toggleMenu=open=>{const m=$('reader-menu');m.hidden=!(open??m.hidden);$('reader-style').setAttribute('aria-expanded',String(!m.hidden));};
 $('reader-style').onclick=e=>{e.stopPropagation();toggleMenu();};document.addEventListener('click',e=>{if(!$('reader-menu').hidden&&!e.target.closest('#reader-menu'))toggleMenu(false);});
 $('reader-done').onclick=()=>surface.send('close');
 $('reader-smaller').onclick=()=>set('size',Math.max(14,prefs.size-1));$('reader-larger').onclick=()=>set('size',Math.min(30,prefs.size+1));
 document.addEventListener('keydown',e=>{if(e.metaKey&&(e.key==='+'||e.key==='=')){e.preventDefault();$('reader-larger').click();}else if(e.metaKey&&e.key==='-'){e.preventDefault();$('reader-smaller').click();}else if(e.metaKey&&e.key==='0'){e.preventDefault();set('size',19);}
  else if(e.key==='Escape'&&!$('reader-menu').hidden){e.stopPropagation();toggleMenu(false);}});
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;e.preventDefault();surface.send('open',{url:a.href,newTab:e.metaKey||e.button===1});});
 document.addEventListener('auxclick',e=>{const a=e.target.closest('a[href]');if(a&&e.button===1){e.preventDefault();surface.send('open',{url:a.href,newTab:true});}});
 function look(s){if(typeof s.dark==='boolean')dark=s.dark;if(s.language&&s.language!==language){language=s.language;menu();for(const b of document.querySelectorAll('#reader-bar [title]')){b.dataset.key??=b.title;b.title=t(b.dataset.key);b.setAttribute('aria-label',b.title);}}if(s.prefs)prefs={...prefs,...s.prefs};applySurfaceTheme({language:s.language,reduceMotion:s.reduceMotion});root.removeAttribute('data-theme');apply();}
 surface.on(s=>{if(!s)return;look(s);if(s.type==='article'&&s.article)render(s.article);});
 menu();surface.ask('article').then(s=>{if(s){look(s);if(s.article)render(s.article);}}).catch(()=>{});
})();

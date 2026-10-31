// Reader view (0.45): finds the article in a page and returns it as a small tree of allowed elements, never as HTML.
// It runs in an isolated world of the page (reader.cjs) and is also loaded by the unit tests with a fake document.
// The approach follows Safari Reader and Mozilla's Readability: paragraphs score their containers by length and
// commas, containers that look like navigation, comments or ads lose points, and the best container is cleaned.
// probe() is the cheap check behind the address-bar button: enough long paragraphs of real text.
(function(root){
 const UNLIKELY=/banner|breadcrumb|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote|newsletter|subscribe|cookie|consent|share|promo|outbrain|taboola/i;
 const MAYBE=/and|article|body|column|content|main|shadow|story|entry|post|text/i;
 const POSITIVE=/article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i;
 const NEGATIVE=/-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|footer|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|widget|newsletter|subscribe/i;
 const DROP=new Set(['SCRIPT','STYLE','NOSCRIPT','IFRAME','FORM','BUTTON','INPUT','SELECT','TEXTAREA','NAV','ASIDE','FOOTER','SVG','CANVAS','OBJECT','EMBED','DIALOG','TEMPLATE','LINK','META']);
 // Elements the reader page may draw, and the attributes each keeps.
 const KEEP={P:1,H1:1,H2:1,H3:1,H4:1,H5:1,H6:1,UL:1,OL:1,LI:1,BLOCKQUOTE:1,PRE:1,CODE:1,EM:1,I:1,STRONG:1,B:1,U:1,S:1,SUB:1,SUP:1,SMALL:1,MARK:1,BR:1,HR:1,A:1,IMG:1,FIGURE:1,FIGCAPTION:1,PICTURE:0,TABLE:1,THEAD:1,TBODY:1,TR:1,TD:1,TH:1,CAPTION:1,DL:1,DT:1,DD:1,Q:1,CITE:1,TIME:1,ABBR:1,KBD:1,VAR:1,SAMP:1,DEL:1,INS:1};
 const BLOCKISH=new Set(['DIV','SECTION','ARTICLE','MAIN','HEADER','SPAN','FONT','CENTER']);
 const text=n=>(n.textContent||'').replace(/\s+/g,' ').trim();
 const classId=n=>((n.className&&typeof n.className==='string'?n.className:'')+' '+(n.id||''));
 function weight(n){const s=classId(n);let w=0;if(NEGATIVE.test(s))w-=25;if(POSITIVE.test(s))w+=25;return w;}
 function linkDensity(n){const all=text(n).length;if(!all)return 0;let links=0;for(const a of n.querySelectorAll('a'))links+=text(a).length;return links/all;}
 function hidden(n){if(n.hidden||n.getAttribute?.('aria-hidden')==='true')return true;const st=n.getAttribute?.('style')||'';return /display\s*:\s*none|visibility\s*:\s*hidden/i.test(st);}
 function paragraphs(doc){return [...doc.querySelectorAll('p,pre,td,blockquote,li,div > br')].map(n=>n.tagName==='BR'?n.parentNode:n);}
 // Cheap: is there an article here at all?
 function probe(doc){let score=0;for(const p of doc.querySelectorAll('p,pre,article div')){if(hidden(p))continue;const s=classId(p);if(UNLIKELY.test(s)&&!MAYBE.test(s))continue;const len=text(p).length;if(len<140)continue;score+=Math.sqrt(len-140);if(score>20)return true;}return false;}
 function candidates(doc){const scores=new Map();const add=(n,v)=>{if(!n||n.nodeType!==1||n===doc.documentElement)return;if(!scores.has(n))scores.set(n,(n.tagName==='ARTICLE'||n.tagName==='MAIN'?10:/^(DIV|SECTION)$/.test(n.tagName)?5:/^(PRE|TD|BLOCKQUOTE)$/.test(n.tagName)?3:/^(OL|UL|DL|FORM|ADDRESS)$/.test(n.tagName)?-3:/^H[1-6]$|^TH$/.test(n.tagName)?-5:0)+weight(n));scores.set(n,scores.get(n)+v);};
  for(const p of new Set(paragraphs(doc))){if(!p||hidden(p))continue;let skip=false;for(let a=p;a&&a!==doc.body;a=a.parentNode){if(a.nodeType===1&&(DROP.has(a.tagName)||(UNLIKELY.test(classId(a))&&!MAYBE.test(classId(a))&&a.tagName!=='BODY'&&a.tagName!=='ARTICLE')||hidden(a))){skip=true;break;}}if(skip)continue;
   const t=text(p);if(t.length<25)continue;const v=1+t.split(/[,，、]/).length-1+Math.min(3,Math.floor(t.length/100));
   add(p.parentNode,v);add(p.parentNode?.parentNode,v/2);add(p.parentNode?.parentNode?.parentNode,v/3);}
  return [...scores].map(([n,s])=>({n,s:s*(1-linkDensity(n))})).sort((a,b)=>b.s-a.s);}
 // The best container, widened to a parent that holds more of the same article (pages that split it in sections).
 function best(doc){const list=candidates(doc);if(!list.length)return doc.querySelector('article')||doc.querySelector('main')||null;let top=list[0].n;
  for(let p=top.parentNode;p&&p!==doc.body&&p.nodeType===1;p=p.parentNode){const entry=list.find(x=>x.n===p);if(entry&&entry.s>=list[0].s*.75)top=p;}
  // An <article> that contains the winner is the article.
  for(let p=top;p&&p.nodeType===1;p=p.parentNode)if(p.tagName==='ARTICLE'){top=p;break;}return top;}
 function absolute(url,base){try{const u=new URL(url,base);return /^(https?:|mailto:)$/.test(u.protocol)?u.href:'';}catch{return '';}}
 function imageSource(img,base){const pick=[img.getAttribute('src'),img.getAttribute('data-src'),img.getAttribute('data-lazy-src'),img.getAttribute('data-original')].find(s=>s&&!/^data:image\/(gif|svg)/.test(s));
  let src=pick||'';const set=img.getAttribute('srcset')||img.getAttribute('data-srcset')||'';if(set){const parts=set.split(',').map(s=>s.trim().split(/\s+/)).filter(p=>p[0]);const widest=parts.sort((a,b)=>parseFloat(b[1]||0)-parseFloat(a[1]||0))[0];if(widest&&(!src||parseFloat(widest[1]||0)<=1600))src=widest[0];}
  return absolute(src,base);}
 // Builds the tree: [tag, attributes, ...children] arrays and strings. Unknown elements keep only their content.
 function clean(n,base,state){if(n.nodeType===3){const t=n.nodeValue.replace(/\s+/g,' ');state.chars+=t.trim().length;return t?[t]:[];}
  if(n.nodeType!==1||DROP.has(n.tagName)||hidden(n))return [];if(state.nodes++>20000)return [];
  const cls=classId(n);if(n!==state.root&&!/^(P|LI|TD|TH|PRE|CODE|BLOCKQUOTE|FIGURE|IMG|A)$/.test(n.tagName)&&NEGATIVE.test(cls)&&!POSITIVE.test(cls)&&linkDensity(n)>.2)return [];
  // The byline, date and share rows are shown once, in the reader's own header.
  if(n!==state.root&&!/^(LI|TD|TH|PRE|CODE|IMG|A)$/.test(n.tagName)&&/byline|author|dateline|timestamp|posted-on|article-meta|share|social/i.test(cls)&&text(n).length<160)return [];
  if(n!==state.root&&BLOCKISH.has(n.tagName)&&text(n).length<80&&linkDensity(n)>.5&&!n.querySelector('img'))return [];
  const kids=[];for(const c of n.childNodes)kids.push(...clean(c,base,state));
  const tag=n.tagName;if(tag==='IMG'){const src=imageSource(n,base);if(!src)return [];const w=+n.getAttribute('width')||0;if(w&&w<64)return [];return [['img',{src,alt:(n.getAttribute('alt')||'').slice(0,300)}]];}
  if(tag==='A'){const href=absolute(n.getAttribute('href')||'',base);return href?[['a',{href},...kids]]:kids;}
  if(/^H[1-6]$/.test(tag)&&text(n)===state.title)return [];
  if(KEEP[tag]){const out=[tag.toLowerCase(),{}];if(tag==='OL'&&n.getAttribute('start'))out[1].start=String(+n.getAttribute('start')||1);if((tag==='TD'||tag==='TH')&&+n.getAttribute('colspan')>1)out[1].colspan=String(Math.min(20,+n.getAttribute('colspan')));out.push(...kids);
   if(/^(P|LI|FIGURE|BLOCKQUOTE|UL|OL|TABLE)$/.test(tag)&&!kids.some(k=>typeof k==='string'?k.trim():true))return [];return [out];}
  // A div of text becomes a paragraph; one that holds blocks only passes its blocks through.
  if(BLOCKISH.has(tag)&&kids.length&&kids.every(k=>typeof k==='string'||['a','em','strong','b','i','code','br','span','img','sub','sup','mark','small'].includes(k[0]))&&text(n).length>0)return tag==='SPAN'||tag==='FONT'?kids:[['p',{},...kids]];
  return kids;}
 function meta(doc,...names){for(const name of names){const el=doc.querySelector(`meta[property="${name}"],meta[name="${name}"]`);const v=el?.getAttribute('content');if(v&&v.trim())return v.trim();}return '';}
 function extract(doc,url){const base=url||doc.baseURI;if(!doc.body)return null;
  let title=meta(doc,'og:title','twitter:title')||text(doc.querySelector('h1')||{})||doc.title||'';title=title.replace(/\s+[|–—·-]\s+[^|–—·-]{2,40}$/,'').slice(0,300).trim();
  const site=meta(doc,'og:site_name','application-name')||(()=>{try{return new URL(base).hostname.replace(/^www\./,'');}catch{return '';}})();
  let byline=meta(doc,'author','article:author','parsely-author','sailthru.author');if(/^https?:/.test(byline))byline='';if(!byline){const b=doc.querySelector('[rel=author],[itemprop=author] [itemprop=name],[itemprop=author],.byline,.author');byline=b?text(b).slice(0,120):'';}
  const published=meta(doc,'article:published_time','datePublished','date','pubdate')||doc.querySelector('time[datetime]')?.getAttribute('datetime')||'';
  const top=best(doc);if(!top)return null;const state={chars:0,nodes:0,root:top,title};const tree=clean(top,base,state);
  let lead='';const hero=meta(doc,'og:image');if(hero&&!JSON.stringify(tree).includes('"img"'))lead=absolute(hero,base);
  const words=(text(top).match(/\S+/g)||[]).length;
  return {title,site,byline:byline.replace(/^by\s+/i,'').slice(0,120),published:published.slice(0,40),lang:doc.documentElement.lang||'',dir:doc.documentElement.dir==='rtl'?'rtl':'ltr',lead,minutes:Math.max(1,Math.round(words/230)),chars:state.chars,url:base,tree};}
 const api={extract,probe};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PrismReader=api;
})(typeof window!=='undefined'?window:globalThis);

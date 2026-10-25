// Release notes (0.36): every Prism release since 0.24.1 (the version on GitHub before this one) as one page that
// opens in a tab, the way Arc shows its release notes. It is built from CHANGELOG.md, served by Prism itself at
// prism-notes://release, and needs no network.
const fs=require('node:fs'),path=require('node:path');
const BASE='0.24.1';
const newer=(a,b)=>{const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0);}return false;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// "**Lead.** Rest" and `code` in a line of markdown, escaped.
const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
function parse(markdown){const releases=[];let current=null,section=null;
 for(const line of String(markdown).split('\n')){
  const head=line.match(/^##\s+(\d+\.\d+(?:\.\d+)?)\s*(?:[—-]\s*(.*))?$/);if(head){current={version:head[1],title:(head[2]||'').trim(),sections:[]};releases.push(current);section=null;continue;}
  if(!current)continue;const sub=line.match(/^###\s+(.+)$/);if(sub){section={name:sub[1].trim(),items:[]};current.sections.push(section);continue;}
  const item=line.match(/^\s*-\s+(.+)$/);if(item){if(!section){section={name:'New',items:[]};current.sections.push(section);}section.items.push(item[1].trim());}}
 return releases;}
function render({markdown,logo,version}){
 const releases=parse(markdown).filter(r=>newer(r.version.split('.').length<3?r.version+'.0':r.version,BASE)).map(r=>({...r,sections:r.sections.filter(s=>!/install/i.test(s.name)&&s.items.length)}));
 const cards=releases.map((r,i)=>`<article class="release${i===0?' latest':''}" id="v${esc(r.version)}"><header><span class="version">Prism ${esc(r.version)}</span>${i===0?'<span class="badge">You have this</span>':''}<h2>${inline(r.title)}</h2></header>${r.sections.map(s=>`<section><h3>${esc(s.name)}</h3><ul>${s.items.map(it=>`<li>${inline(it)}</li>`).join('')}</ul></section>`).join('')}</article>`).join('');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><title>Prism release notes</title><style>
:root{color-scheme:light dark;--ink:#1d1f24;--muted:#626875;--card:#ffffffd9;--line:#0000001a;--bg:#f5f4f1}
@media(prefers-color-scheme:dark){:root{--ink:#eceef2;--muted:#9aa1ad;--card:#1f2228d9;--line:#ffffff1f;--bg:#141619}}
*{box-sizing:border-box}body{margin:0;font:15px/1.55 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:var(--ink);background:var(--bg)}
.hero{position:relative;padding:72px 24px 40px;text-align:center;overflow:hidden}
.hero:before{content:'';position:absolute;inset:-40% -10% auto;height:120%;background:conic-gradient(from 200deg at 50% 60%,#ff7a7a,#ffb85c,#f2e05a,#6fdc9a,#5fb4ff,#a98bff,#ff7ad1,#ff7a7a);filter:blur(80px);opacity:.28;-webkit-mask:linear-gradient(#000 55%,transparent);mask:linear-gradient(#000 55%,transparent)}
.hero img{position:relative;width:88px;height:88px}.hero h1{position:relative;margin:14px 0 6px;font-size:40px;letter-spacing:-.02em}.hero p{position:relative;margin:0;color:var(--muted);font-size:16px}
main{max-width:760px;margin:0 auto;padding:8px 20px 80px;display:flex;flex-direction:column;gap:18px}
.release{position:relative;padding:26px 28px 22px;border-radius:22px;background:var(--card);box-shadow:0 1px 0 #ffffff80 inset,0 0 0 .5px var(--line),0 10px 30px #00000014;backdrop-filter:blur(20px)}
.release.latest:before{content:'';position:absolute;inset:0;border-radius:inherit;padding-top:3px;background:linear-gradient(90deg,#ff7a7a,#ffb85c,#f2e05a,#6fdc9a,#5fb4ff,#a98bff,#ff7ad1);-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
header .version{font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}.badge{margin-left:8px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;background:#5fb4ff2e;color:#2f7ad1}
h2{margin:6px 0 4px;font-size:24px;letter-spacing:-.01em;line-height:1.25}h3{margin:18px 0 6px;font-size:13px;font-weight:600;color:var(--muted)}
ul{margin:0;padding-left:20px}li{margin:6px 0}li strong{font-weight:600}code{font:13px ui-monospace,Menlo,monospace;padding:1px 5px;border-radius:5px;background:#8881}
footer{text-align:center;color:var(--muted);font-size:13px;padding-bottom:40px}
</style></head><body><div class="hero">${logo?`<img src="${logo}" alt="">`:''}<h1>What’s new in Prism</h1><p>Everything since Prism ${BASE}, newest first. You have Prism ${esc(version)}.</p></div><main>${cards}</main><footer>Prism is free software under the GPL-3.0.</footer></body></html>`;}
function register(session,{root,version}){
 session.protocol.handle('prism-notes',()=>{let markdown='',logo='';try{markdown=fs.readFileSync(path.join(root,'CHANGELOG.md'),'utf8');}catch{}try{logo='data:image/png;base64,'+fs.readFileSync(path.join(root,'assets','prism-glass.png')).toString('base64');}catch{}
  return new Response(render({markdown,logo,version}),{headers:{'content-type':'text/html; charset=utf-8'}});});}
module.exports={register,render,parse,URL:'prism-notes://release'};

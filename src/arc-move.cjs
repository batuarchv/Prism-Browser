// Moving from Arc (0.50): one page that brings an Arc user over (import, Google sign-in, default browser) and shows
// where Arc's features live in Prism. Served at prism-notes://arc beside the release notes; its buttons are
// prism-notes://do/<command> links, which Prism runs and answers with 204, so the page stays put.
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COMMANDS=['import-arc','google-signin','default-browser','tour'];
const MAP=[['Command bar','Beam','⌘T'],['Peek','Lens','⇧-click or force click a link'],['Little Arc','Lens window','⌥⌘N'],['Spaces','Spaces','⌃1 – ⌃9'],['Pinned tabs and Favorites','Pinned and Favorites','drag a tab up'],['Split View','Split view','drag a tab onto the page'],['Auto-archive','Tidy and Archive','⌥⌘K'],['Boosts (hide parts of a site)','Erase elements','site controls, lock icon'],['Media controls','Sidebar miniplayer','plays when you leave the tab'],['Arc Max','Ask in Beam','Claude or Apple Intelligence'],['Arc ad blocking','Prism Shield','on by default']];
function render({logo='',t=k=>k}={}){
 const step=(n,title,text,cmd,label)=>`<article class="step"><span class="n">${n}</span><div><h2>${esc(t(title))}</h2><p>${esc(t(text))}</p></div><a class="button" href="prism-notes://do/${cmd}">${esc(t(label))}</a></article>`;
 return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><title>${esc(t('Moving from Arc'))}</title><style>
:root{color-scheme:light dark;--ink:#1d1f24;--muted:#626875;--card:#ffffffd9;--line:#0000001a;--bg:#f5f4f2;--accent:#0a84ff}
@media(prefers-color-scheme:dark){:root{--ink:#eceef2;--muted:#9aa1ad;--card:#1f2228d9;--line:#ffffff1f;--bg:#141619}}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:var(--ink);background:var(--bg)}
.hero{position:relative;padding:64px 24px 28px;text-align:center;overflow:hidden}
.hero:before{content:'';position:absolute;inset:-40% -10% auto;height:120%;background:conic-gradient(from 200deg at 50% 60%,#ff7a7a,#ffb85c,#f2e05a,#6fdc9a,#5fb4ff,#a98bff,#ff7ad1,#ff7a7a);filter:blur(80px);opacity:.24;-webkit-mask:linear-gradient(#000 55%,transparent)}
.hero img{position:relative;width:76px;height:76px}.hero h1{position:relative;margin:12px 0 6px;font-size:36px;letter-spacing:-.02em}.hero p{position:relative;margin:0 auto;max-width:520px;color:var(--muted);font-size:16px}
main{max-width:720px;margin:0 auto;padding:8px 20px 72px;display:flex;flex-direction:column;gap:12px}
.step{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:16px;padding:18px 20px;border-radius:18px;background:var(--card);box-shadow:0 1px 0 #ffffff80 inset,0 0 0 .5px var(--line),0 8px 24px #00000012}
.n{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);font-weight:600}
h2{margin:0 0 2px;font-size:17px}p{margin:0;color:var(--muted)}
.button{padding:8px 14px;border-radius:999px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;font-size:13px;white-space:nowrap}.button:active{transform:scale(.97)}
h3{margin:28px 4px 6px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
table{width:100%;border-collapse:collapse;border-radius:18px;overflow:hidden;background:var(--card);box-shadow:0 0 0 .5px var(--line)}
td{padding:11px 16px;border-top:.5px solid var(--line)}tr:first-child td{border-top:0}td:first-child{color:var(--muted)}td:nth-child(2){font-weight:600}td:last-child{color:var(--muted);font-size:13px;text-align:right}
@media(max-width:560px){.step{grid-template-columns:32px 1fr}.button{grid-column:2;justify-self:start}td:last-child{display:none}}
</style></head><body><div class="hero">${logo?`<img src="${logo}" alt="">`:''}<h1>${esc(t('Moving from Arc'))}</h1><p>${esc(t('Arc stops opening on December 22. Bring everything over in a minute; nothing leaves your Mac.'))}</p></div><main>
${step(1,'Bring your Arc','Pinned tabs, favorites, bookmarks, passwords and history, from every Arc profile.','import-arc','Import from Arc')}
${step(2,'Stay signed in to Google','Google blocks new sign-ins in some browsers. Prism can carry over the sign-in you already have in Arc.','google-signin','Bring Google Sign-in')}
${step(3,'Make Prism your browser','Links from other apps open in Prism.','default-browser','Make Default')}
<h3>${esc(t('Where things are'))}</h3><table>${MAP.map(([arc,prism,how])=>`<tr><td>${esc(t(arc))}</td><td>${esc(t(prism))}</td><td>${esc(t(how))}</td></tr>`).join('')}</table>
<p style="text-align:center;margin-top:18px"><a href="prism-notes://do/tour" style="color:var(--accent);text-decoration:none">${esc(t('Show me around Prism'))}</a></p>
</main></body></html>`;}
module.exports={render,COMMANDS,URL:'prism-notes://arc'};

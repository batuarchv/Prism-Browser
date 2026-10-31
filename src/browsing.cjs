const LIMIT=2000;
function cleanURL(value){try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol))return null;u.username='';u.password='';return u.href;}catch{return null;}}
function visit(history,tab,now=Date.now()){
 const url=cleanURL(tab.url);if(tab.space==='private'||!url)return history;
 // visits (0.44) counts how often a page was opened, so Beam can put the sites you use most first.
 const before=history.find(x=>x.url===url);
 // spaces (0.47) lists the spaces a page was opened in, so each space suggests its own pages. Rows from before 0.47
 // (and imported history) have none and are suggested everywhere.
 const spaces=before?(Array.isArray(before.spaces)?[...new Set([...before.spaces,tab.space])].slice(-40):undefined):[tab.space];
 return [{url,title:String(tab.title||url).slice(0,500),visitedAt:now,visits:Math.min(9999,(Number(before?.visits)||1)+(before?1:0)),...(spaces?{spaces}:{})},...history.filter(x=>x.url!==url)].slice(0,LIMIT);
}
function closedTabs(){const rows=[];return {push(t,index){if(t.space==='private'||!cleanURL(t.url))return;rows.push({url:cleanURL(t.url),title:t.title,space:t.space,pinned:!!t.pinned,...(t.pinned&&t.home?{home:t.home,homeTitle:t.homeTitle}:{}),...(Number.isInteger(index)&&index>=0?{index}:{}),...(t.customTitle?{customTitle:t.customTitle}:{}),keepAwake:!!t.keepAwake,favoriteId:t.favoriteId});if(rows.length>25)rows.shift();},list(space,limit=6){return rows.filter(r=>r.space===space).slice(-limit).reverse().map(({url,title})=>({url,title:String(title||'').slice(0,200)}));},pop(space,url){const i=url?rows.findLastIndex(r=>r.space===space&&r.url===url):rows.findLastIndex(t=>t.space===space);return i<0?null:rows.splice(i,1)[0];}};}
function inSpace(row,space){return !Array.isArray(row?.spaces)||row.spaces.includes(space);}
module.exports={visit,closedTabs,cleanURL,inSpace};

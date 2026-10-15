const LIMIT=2000;
function cleanURL(value){try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol))return null;u.username='';u.password='';return u.href;}catch{return null;}}
function visit(history,tab,now=Date.now()){
 const url=cleanURL(tab.url);if(tab.space==='private'||!url)return history;
 return [{url,title:String(tab.title||url).slice(0,500),visitedAt:now},...history.filter(x=>x.url!==url)].slice(0,LIMIT);
}
function closedTabs(){const rows=[];return {push(t){if(t.space==='private'||!cleanURL(t.url))return;rows.push({url:cleanURL(t.url),title:t.title,space:t.space,pinned:!!t.pinned,keepAwake:!!t.keepAwake,favoriteId:t.favoriteId});if(rows.length>25)rows.shift();},pop(space){const i=rows.findLastIndex(t=>t.space===space);return i<0?null:rows.splice(i,1)[0];}};}
module.exports={visit,closedTabs,cleanURL};

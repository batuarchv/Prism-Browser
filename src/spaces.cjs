const SPACES=['personal','work','private'];
function normalTabs(tabs){return tabs.filter(t=>t.space!=='private').map(t=>({url:t.url,title:t.title,keepAwake:t.keepAwake,space:t.space||'personal',pinned:!!t.pinned,...(t.favoriteId?{favoriteId:t.favoriteId}:{})}));}
function inSpace(tab,space){return (tab.space||'personal')===space;}
module.exports={SPACES,normalTabs,inSpace};

// A favorite owns a tab by bookmark identity, even after redirects/navigation.
function favoriteTab(tabs,bookmark,space){
 return tabs.find(t=>t.space===space&&t.favoriteId===bookmark.id)||tabs.find(t=>t.space===space&&!t.favoriteId&&t.url===bookmark.url);
}
// Only explicit address-bar changes open a new tab. Website links stay in the favorite.
function opensNewFavoriteTab(tab,bookmark,url){return !!(tab?.favoriteId&&bookmark?.favorite&&bookmark.id===tab.favoriteId&&url!==tab.url);}
module.exports={favoriteTab,opensNewFavoriteTab};

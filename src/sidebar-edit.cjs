// Sidebar editing helpers kept free of Electron so their rules are unit-tested.

// Tabs in the order the sidebar shows them: pinned first, favorite-bound tabs live in Favorites instead.
function visibleTabs(tabs,space,favoriteIds=new Set()){return tabs.filter(t=>t.space===space&&!favoriteIds.has(t.favoriteId)).map((t,i)=>({t,i})).sort((a,b)=>Number(!!b.t.pinned)-Number(!!a.t.pinned)||a.i-b.i).map(x=>x.t);}

// "Close other tabs" and "Close tabs below" never close pinned tabs, the chosen tab, or tabs in another space.
function closeTargets(tabs,id,mode,space,favoriteIds){
 const list=visibleTabs(tabs,space,favoriteIds),index=list.findIndex(t=>t.id===id);if(mode==='all')return list.filter(t=>!t.pinned).map(t=>t.id);if(index<0)return [];
 const pool=mode==='others'?list.filter(t=>t.id!==id):mode==='below'?list.slice(index+1):[];
 return pool.filter(t=>!t.pinned).map(t=>t.id);
}

// Library edits that can be undone keep a deep copy of the bookmarks and folders they replace.
function snapshotLibrary(library){return {bookmarks:library.bookmarks.map(b=>({...b})),folders:[...library.folders]};}
function restoreLibrary(library,snapshot){library.bookmarks=snapshot.bookmarks.map(b=>({...b}));library.folders=[...snapshot.folders];return library;}
function deleteFolderWithBookmarks(library,folder){library.bookmarks=library.bookmarks.filter(b=>b.folder!==folder);library.folders=library.folders.filter(f=>f!==folder);return library;}

module.exports={visibleTabs,closeTargets,snapshotLibrary,restoreLibrary,deleteFolderWithBookmarks};

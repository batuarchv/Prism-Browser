const test=require('node:test'),assert=require('node:assert/strict');
const {visibleTabs,closeTargets,snapshotLibrary,restoreLibrary,deleteFolderWithBookmarks}=require('../src/sidebar-edit.cjs');
const tabs=[{id:1,space:'personal'},{id:2,space:'personal',pinned:true},{id:3,space:'work'},{id:4,space:'personal'},{id:5,space:'personal',favoriteId:'fav'},{id:6,space:'personal'}];
test('sidebar order puts pinned tabs first and leaves favorite tabs out',()=>{assert.deepEqual(visibleTabs(tabs,'personal',new Set(['fav'])).map(t=>t.id),[2,1,4,6]);});
test('close others and close below spare pinned, favorite and other-space tabs',()=>{
 const fav=new Set(['fav']);
 assert.deepEqual(closeTargets(tabs,4,'others','personal',fav),[1,6]);
 assert.deepEqual(closeTargets(tabs,1,'below','personal',fav),[4,6]);
 assert.deepEqual(closeTargets(tabs,6,'below','personal',fav),[]);
 assert.deepEqual(closeTargets(tabs,undefined,'all','personal',fav),[1,4,6],'close all keeps pinned tabs, favorites and other spaces');
 assert.deepEqual(closeTargets(tabs,2,'below','personal',fav),[1,4,6],'below a pinned tab closes the unpinned tabs under it');
 assert.deepEqual(closeTargets(tabs,3,'others','personal',fav),[],'a tab from another space is not a valid anchor');
 assert.deepEqual(closeTargets(tabs,4,'everything','personal',fav),[]);
});
test('folder deletion is undoable from a snapshot',()=>{
 const library={bookmarks:[{id:'a',folder:'Work'},{id:'b',folder:''},{id:'c',folder:'Work'}],folders:['Work','Read']};
 const before=snapshotLibrary(library);deleteFolderWithBookmarks(library,'Work');
 assert.deepEqual(library.bookmarks.map(b=>b.id),['b']);assert.deepEqual(library.folders,['Read']);
 before.bookmarks[0].title='changed later';restoreLibrary(library,snapshotLibrary({bookmarks:[{id:'a',folder:'Work'},{id:'b',folder:''},{id:'c',folder:'Work'}],folders:['Work','Read']}));
 assert.deepEqual(library.bookmarks.map(b=>b.id),['a','b','c']);assert.deepEqual(library.folders,['Work','Read']);
 const snap=snapshotLibrary(library);library.bookmarks[0].folder='Moved';assert.equal(snap.bookmarks[0].folder,'Work','snapshots are deep copies');
});

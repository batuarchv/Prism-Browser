const {test}=require('node:test');const assert=require('node:assert/strict');const crypto=require('node:crypto');const {arcBookmarks,mergeBookmarks,bookmark}=require('../src/library.cjs');const {decryptV10}=require('../src/arc-import.cjs');
test('Arc pinned folders preserve grouping, favorites, and ignore unpinned tabs',()=>{
 const document={sidebar:{containers:[{items:['root',{id:'root',childrenIds:['folder','bad']},'folder',{id:'folder',title:'Projects',data:{list:{}},childrenIds:['link','root']},'link',{id:'link',data:{tab:{savedURL:'https://example.com',savedTitle:'Example'}}},'fav',{id:'fav',data:{tab:{savedURL:'https://example.org'}}},'bad',{id:'bad',data:{tab:{savedURL:'javascript:alert(1)'}}}],spaces:['space',{title:'Work',newContainerIDs:[{pinned:{}},'root',{unpinned:{}},'ignored']}],topAppsContainerIDs:[{default:true},'fav']}]} };
 const entries=arcBookmarks(document);assert.equal(entries.length,2);assert.equal(entries[0].favorite,true);assert.equal(entries[1].folder,'Work / Projects');assert.equal(mergeBookmarks(entries,entries).added,0);assert.throws(()=>bookmark({url:'file:///etc/passwd'}));
});
test('macOS v10 cookie integrity is bound to its host',()=>{
 const key=crypto.randomBytes(16);const host='.example.com';const value='synthetic-test-only';const cipher=crypto.createCipheriv('aes-128-cbc',key,Buffer.alloc(16,32));const encrypted=Buffer.concat([Buffer.from('v10'),cipher.update(Buffer.concat([crypto.createHash('sha256').update(host).digest(),Buffer.from(value)])),cipher.final()]);
 assert.equal(decryptV10(encrypted,key,host),value);assert.throws(()=>decryptV10(encrypted,key,'.other.example'));assert.throws(()=>decryptV10(Buffer.from('v20'),key));
});

const test=require('node:test'),assert=require('node:assert/strict');
const {siteBypass,clean,within}=require('../src/site-bypass.cjs');const {pacScript}=require('../src/private-network.cjs');
const {setFolderIcon,renameFolder,removeFolder,normalizeFolderIcons}=require('../src/folders.cjs');const {setting}=require('../src/settings.cjs');
test('chosen sites route with their companions and learn what their tabs load',async()=>{
 const settings={bypassNormal:'sites',bypassSites:['discord.com']};let reroutes=0;const network={state:{status:'active'},reroute:()=>{reroutes++;return Promise.resolve();}};
 const b=siteBypass({settings,network:()=>network});
 assert.ok(b.route().includes('discord.gg')&&b.route().includes('discordapp.net'));
 assert.equal(b.observe({resourceType:'mainFrame',url:'https://discord.com/app',webContentsId:7}),undefined);
 await b.observe({resourceType:'script',url:'https://hcaptcha.com/1/api.js',webContentsId:7});assert.equal(reroutes,1);assert.ok(b.route().includes('hcaptcha.com'));
 assert.equal(b.observe({resourceType:'image',url:'https://cdn.discordapp.com/a.png',webContentsId:7}),undefined,'companions are already routed');
 assert.equal(b.observe({resourceType:'script',url:'https://example.org/x.js',webContentsId:9}),undefined,'other tabs never add hosts');
 b.observe({resourceType:'mainFrame',url:'https://example.org/',webContentsId:7});assert.equal(b.observe({resourceType:'script',url:'https://other.net/x.js',webContentsId:7}),undefined,'leaving the site stops learning');
 settings.bypassNormal='all';assert.equal(b.route(),null,'all sites uses a fixed proxy');
});
test('site names are cleaned and matched by domain',()=>{
 assert.equal(clean('https://www.Discord.com/channels/1'),'discord.com');assert.equal(clean('not a site'),'');assert.equal(clean('localhost'),'');
 assert.ok(within('gateway.discord.gg',['discord.gg']));assert.ok(!within('notdiscord.gg',['discord.gg']));
 assert.deepEqual(setting('bypassSites',['discord.com','https://x.com/home','discord.com','??']),['discord.com','x.com']);
 assert.equal(setting('bypassNormal','sites'),'sites');assert.equal(setting('bypassNormal','sometimes'),undefined);
});
test('the PAC script sends only listed domains to the helper',()=>{
 const body=Buffer.from(pacScript(4321,['discord.com','bad host"']).split(',')[1],'base64').toString();
 const FindProxyForURL=new Function('dnsDomainIs',body+';return FindProxyForURL;')((h,d)=>h.endsWith(d));
 assert.equal(FindProxyForURL('','gateway.discord.com'),'SOCKS 127.0.0.1:4321');assert.equal(FindProxyForURL('','DISCORD.com'),'SOCKS 127.0.0.1:4321');
 assert.equal(FindProxyForURL('','example.com'),'DIRECT');assert.ok(!body.includes('bad host'));
});
test('folder symbols follow renames and removals',()=>{
 const library={folders:['Work','Work / Docs'],bookmarks:[]};
 setFolderIcon(library,'Work','briefcase');setFolderIcon(library,'Work / Docs','book');assert.throws(()=>setFolderIcon(library,'Work','drop'));assert.throws(()=>setFolderIcon(library,'Nope','star'));
 renameFolder(library,'Work','Job');assert.deepEqual(library.folderIcons,{Job:'briefcase','Job / Docs':'book'});
 setFolderIcon(library,'Job','folder');assert.deepEqual(library.folderIcons,{'Job / Docs':'book'});
 removeFolder(library,'Job / Docs');assert.deepEqual(library.folderIcons,{});
 assert.deepEqual(normalizeFolderIcons({a:'star',b:'drop',c:'folder'}),{a:'star'});
});

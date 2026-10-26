// 0.39 (PRISM_TEST_FLOW=bypass-flow.cjs): the built-in bypass in normal spaces. Only chosen sites routes discord.com
// and its companions through the bundled helper while other sites stay direct; Discord loads through it; All sites
// routes everything; Off goes back to direct.
const assert=require('node:assert/strict');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,action,snapshot,makeTab,normalNetwork})=>{const {session}=require('electron');
 const until=async(fn,label,ms=15000)=>{const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await wait(150);}throw Error('Timed out: '+label);};
 const ses=session.fromPartition(snapshot().browserPartition);
 await action('set-setting',{key:'bypassSites',value:['discord.com']});await action('set-setting',{key:'bypassNormal',value:'sites'});
 await until(()=>normalNetwork().state.status==='active','bypass starts');
 const routed=await ses.resolveProxy('https://gateway.discord.gg/'),direct=await ses.resolveProxy('https://example.com/');
 assert.match(routed,/127\.0\.0\.1:\d+/,'discord.gg goes through the helper: '+routed);assert.equal(direct,'DIRECT');
 const tab=makeTab('https://discord.com/login',true);let failed='';tab.view.webContents.on('did-fail-load',(_e,code,desc,url,main)=>{if(main)failed=desc;});
 await until(()=>!tab.view.webContents.isLoading()&&tab.view.webContents.getURL().includes('discord'),'Discord loads',30000);await wait(3000);
 assert.equal(failed,'','Discord main frame loaded');const title=tab.view.webContents.getTitle();
 const hosts=snapshot().normalNetwork.hosts;
 await action('set-setting',{key:'bypassNormal',value:'all'});await until(async()=>/127\.0\.0\.1/.test(await ses.resolveProxy('https://example.com/')),'all sites');
 await action('set-setting',{key:'bypassNormal',value:'off'});await until(async()=>await ses.resolveProxy('https://gateway.discord.gg/')==='DIRECT','off');
 console.log(JSON.stringify({routed,direct,title,hosts,helper:normalNetwork().snapshot().available}));
 if(process.env.PRISM_TEST_FLOW?.includes('bypass-flow'))app.exit(0);};

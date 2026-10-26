// Bypass in normal spaces (0.39). Prism's built-in tpws helper can carry every normal site or only the sites you
// choose. A chosen site brings its companion domains (discord.com also routes discord.gg, discordapp.net, its CDN,
// media and gateway hosts), and any other host a chosen site's tab loads joins the route while Prism runs, so the
// connection holds as the site moves between its domains.
const COMPANIONS={
 'discord.com':['discord.gg','discord.co','discord.media','discord.dev','discord.new','discord.gift','discordapp.com','discordapp.net','discordcdn.com','discordstatus.com','dis.gd'],
 'x.com':['twitter.com','twimg.com','t.co','pscp.tv','periscope.tv'],
 'twitter.com':['x.com','twimg.com','t.co'],
 'roblox.com':['rbxcdn.com','roblox.qq.com','rbx.com','robloxlabs.com'],
 'telegram.org':['t.me','telegram.me','telegra.ph','telesco.pe','cdn-telegram.org'],
 'wattpad.com':['wattpad.net','wattpad.dev'],
 'imgur.com':['imgur.io','i.imgur.com'],
 'reddit.com':['redd.it','redditmedia.com','redditstatic.com','reddituploads.com'],
 'youtube.com':['youtu.be','ytimg.com','googlevideo.com','ggpht.com','youtube-nocookie.com'],
};
const LEARNED_LIMIT=400;
const clean=value=>{let host=String(value||'').trim().toLowerCase();if(!host)return '';try{host=new URL(/^[a-z]+:\/\//.test(host)?host:'https://'+host).hostname;}catch{return '';}host=host.replace(/^www\./,'').replace(/\.$/,'');return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)?host:'';};
const within=(host,domains)=>{for(const d of domains)if(host===d||host.endsWith('.'+d))return true;return false;};
function siteBypass({settings,network}){
 const learned=new Set(),tabs=new Set();
 const sites=()=>[...new Set((settings.bypassSites||[]).map(clean).filter(Boolean))];
 const chosen=()=>{const out=new Set();for(const site of sites()){out.add(site);for(const c of COMPANIONS[site]||[])out.add(c);}return [...out];};
 const hosts=()=>[...chosen(),...learned];
 const route=()=>settings.bypassNormal==='sites'?hosts():null;
 // Called for every normal request (before the blocker answers). It returns a promise only when a new host joins the
 // route, so that request waits for the new route instead of leaking out direct and failing.
 function observe(details){
  if(settings.bypassNormal!=='sites'||network()?.state.status!=='active')return;
  let host;try{host=new URL(details.url).hostname.toLowerCase();}catch{return;}
  if(details.resourceType==='mainFrame'){if(within(host,chosen()))tabs.add(details.webContentsId);else tabs.delete(details.webContentsId);return;}
  if(!tabs.has(details.webContentsId)||within(host,hosts())||learned.size>=LEARNED_LIMIT||!/^https?:|^wss?:/.test(details.url))return;
  learned.add(host);return network().reroute();
 }
 function forget(){learned.clear();tabs.clear();}
 return {route,observe,forget,sites,hosts,clean};
}
module.exports={siteBypass,COMPANIONS,clean,within};

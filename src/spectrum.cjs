// Spectrum (0.32): today as a band of light at the foot of the sidebar. Each stripe is the site you were looking at,
// coloured by the site, so a day reads like light through a prism. Prism also notes which tabs were open whenever that
// set changes; scrubbing the band to any moment can bring that set back, asleep. Only today is kept, on this Mac, and
// never anything from Private. Time spent away from Prism's window leaves a gap.
// 0.33: the day is split into chapters (a pause of 20 minutes starts a new one), each named from what its sites are for
// and, with Apple Intelligence, from its page titles (main.cjs asks prism-ai on this Mac). Prism also learns your habits:
// minutes per site for each hour, weekdays and weekends apart, fading by a little every day, so Spectrum can offer the
// sites you usually open around now. Habits keep only site names and minutes, never pages or titles.
const MIN_SEGMENT=15000,MOMENT_GAP=60000,MAX_SEGMENTS=1500,MAX_MOMENTS=240,MAX_TABS=60,CHAPTER_GAP=20*60000,MAX_HABITS=400,HABIT_FADE=.94;
const dayKey=time=>{const d=new Date(time);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
function hostOf(url){try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.hostname.replace(/^www\./,''):'';}catch{return '';}}
// What a site is for, so a chapter can be named without any AI. The first matching group wins.
const KINDS=[
 ['mail',/^(mail\.google|outlook\.(live|office)|mail\.yahoo|proton\.me|mail\.proton|icloud\.com\/mail|fastmail)/],
 ['ai',/^(chatgpt\.com|chat\.openai|claude\.ai|gemini\.google|perplexity\.ai|copilot\.microsoft|poe\.com|grok\.com)/],
 ['code',/^(github\.com|gitlab\.com|bitbucket\.org|stackoverflow\.com|[a-z.]*stackexchange\.com|vercel\.com|netlify|developer\.|docs\.|npmjs\.com|codepen\.io|replit\.com|localhost)/],
 ['work',/^(docs\.google|drive\.google|sheets\.google|slides\.google|notion\.(so|site)|figma\.com|linear\.app|[a-z0-9-]+\.slack\.com|app\.slack|[a-z0-9-]+\.atlassian\.net|trello\.com|asana\.com|miro\.com|calendar\.google|teams\.microsoft|zoom\.us|meet\.google|airtable\.com|canva\.com|office\.com)/],
 ['video',/^(youtube\.com|m\.youtube|youtu\.be|netflix\.com|twitch\.tv|vimeo\.com|disneyplus\.com|primevideo\.com|tv\.apple|max\.com|hulu\.com|blutv|exxen|puhutv|mubi\.com)/],
 ['music',/^(open\.spotify|music\.apple|soundcloud\.com|music\.youtube|deezer\.com|tidal\.com|bandcamp\.com)/],
 ['social',/^(x\.com|twitter\.com|instagram\.com|facebook\.com|reddit\.com|old\.reddit|tiktok\.com|linkedin\.com|threads\.(net|com)|bsky\.app|mastodon|discord\.com|web\.whatsapp|web\.telegram|pinterest\.com|eksisozluk)/],
 ['news',/^(news\.|nytimes\.com|bbc\.|theguardian\.com|cnn\.com|reuters\.com|apnews\.com|bloomberg\.com|ft\.com|wsj\.com|theverge\.com|techcrunch\.com|arstechnica\.com|hurriyet|sozcu|milliyet|ntv\.com|haberturk|bbc\.com|wired\.com|engadget\.com|news\.ycombinator)/],
 ['shopping',/^(amazon\.|ebay\.|etsy\.com|trendyol\.com|hepsiburada\.com|n11\.com|aliexpress|apple\.com\/shop|store\.|shop\.|ikea\.com|zara\.com|walmart\.com|bestbuy\.com|sahibinden)/],
 ['learning',/^([a-z]+\.wikipedia\.org|wikipedia\.org|coursera\.org|udemy\.com|khanacademy\.org|medium\.com|dev\.to|duolingo\.com|edx\.org|arxiv\.org|scholar\.google)/],
 ['travel',/^(booking\.com|airbnb\.|maps\.google|google\.[a-z.]+\/maps|skyscanner|kayak\.|expedia\.|tripadvisor|obilet|enuygun|turkishairlines|pegasus)/],
 ['money',/^(paypal\.com|wise\.com|revolut\.com|coinbase\.com|binance\.com|tradingview\.com|finance\.yahoo|[a-z]+bank|garanti|isbank|akbank|yapikredi|ziraat)/]
];
function kindOf(host){for(const [kind,pattern] of KINDS)if(pattern.test(host))return kind;return 'web';}
const blankHabits=()=>({});
function normalizeHabits(raw){const out={};if(!raw||typeof raw!=='object')return out;for(const [host,row] of Object.entries(raw).slice(0,MAX_HABITS*2))if(host.length<=253&&/^[a-z0-9.-]+$/i.test(host)&&Array.isArray(row)&&row.length===48&&row.every(Number.isFinite))out[host]=row.map(v=>Math.max(0,Math.min(600,v)));return out;}
function fadeHabits(habits,days){const factor=Math.pow(HABIT_FADE,Math.max(1,Math.min(60,days)));for(const host of Object.keys(habits)){const row=habits[host].map(v=>v*factor);if(row.reduce((a,b)=>a+b,0)<.5)delete habits[host];else habits[host]=row;}return habits;}
const daysBetween=(from,to)=>{const [y,m,d]=String(from).split('-').map(Number);const start=new Date(y,m-1,d).getTime();return Number.isFinite(start)?Math.round((new Date(to).setHours(0,0,0,0)-start)/86400000):1;};
function normalize(raw,now){
 const day=dayKey(now);const habits=normalizeHabits(raw?.habits);
 if(!raw||raw.day!==day)return {day,segments:[],moments:[],habits:raw?.day?fadeHabits(habits,daysBetween(raw.day,now)):habits};
 const segments=(Array.isArray(raw.segments)?raw.segments:[]).filter(s=>Number.isFinite(s?.from)&&Number.isFinite(s?.to)&&s.to>=s.from&&typeof s.host==='string'&&s.host.length<=253).map(s=>({from:s.from,to:s.to,host:s.host,...(typeof s.title==='string'&&s.title?{title:s.title.slice(0,120)}:{})})).slice(-MAX_SEGMENTS);
 const moments=(Array.isArray(raw.moments)?raw.moments:[]).filter(m=>Number.isFinite(m?.at)&&Array.isArray(m.tabs)).map(m=>({at:m.at,tabs:m.tabs.filter(t=>/^https?:\/\//.test(t?.url||'')&&typeof t.space==='string'&&t.space!=='private').slice(0,MAX_TABS).map(t=>({url:String(t.url).slice(0,4096),title:String(t.title||'').slice(0,200),space:t.space}))})).slice(-MAX_MOMENTS);
 return {day,segments,moments,habits};
}
// Chapters: runs of segments without a 20-minute pause. Each gets its sites by time and a kind from what they are for.
function chaptersOf(segments){
 const out=[];for(const s of segments){const last=out.at(-1);if(!last||s.from-last.to>CHAPTER_GAP)out.push({from:s.from,to:s.to,parts:[s]});else{last.to=Math.max(last.to,s.to);last.parts.push(s);}}
 return out.map(c=>{const time=new Map();for(const p of c.parts)time.set(p.host,(time.get(p.host)||0)+p.to-p.from);const sites=[...time].sort((a,b)=>b[1]-a[1]).map(([host,ms])=>({host,ms}));
  const kinds=new Map();for(const s of sites){const k=kindOf(s.host);kinds.set(k,(kinds.get(k)||0)+s.ms);}const kind=[...kinds].sort((a,b)=>b[1]-a[1])[0]?.[0]||'web';
  const titles=[...new Set(c.parts.map(p=>p.title).filter(Boolean))].slice(0,8);
  return {from:c.from,to:c.to,active:sites.reduce((n,s)=>n+s.ms,0),kind,sites:sites.slice(0,6),titles};});
}
function createSpectrum({load=()=>null,save=()=>{},now=Date.now}={}){
 let data=normalize(load(),now()),open=null,focused=true,revision=0,saveTimer=null,insights=null;
 const changed=()=>{revision++;clearTimeout(saveTimer);saveTimer=setTimeout(()=>save(data),10000);saveTimer.unref?.();};
 function roll(t){if(data.day!==dayKey(t)){close(t);const previous=data.day;data={day:dayKey(t),segments:[],moments:[],habits:fadeHabits(data.habits||blankHabits(),daysBetween(previous,t))};insights=null;changed();}}
 // Minutes on a site go into its hour of the day, weekdays (0-23) and weekends (24-47) apart.
 function learn(seg){const habits=data.habits||(data.habits=blankHabits());if(!habits[seg.host]){const hosts=Object.keys(habits);if(hosts.length>=MAX_HABITS){const smallest=hosts.reduce((a,b)=>habits[a].reduce((x,y)=>x+y,0)<habits[b].reduce((x,y)=>x+y,0)?a:b);delete habits[smallest];}habits[seg.host]=Array(48).fill(0);}
  let t=seg.from;while(t<seg.to){const d=new Date(t),next=Math.min(seg.to,new Date(d).setMinutes(60,0,0)),slot=d.getHours()+(d.getDay()===0||d.getDay()===6?24:0);habits[seg.host][slot]=Math.min(600,habits[seg.host][slot]+(next-t)/60000);t=next;}}
 function close(t){if(!open)return;const seg={...open,to:t};open=null;if(seg.to-seg.from<MIN_SEGMENT)return;learn(seg);const last=data.segments.at(-1);
  if(last&&last.host===seg.host&&seg.from-last.to<MIN_SEGMENT){last.to=seg.to;if(!last.title&&seg.title)last.title=seg.title;}else data.segments.push(seg);if(data.segments.length>MAX_SEGMENTS)data.segments.shift();changed();}
 // The page in front changed (another tab, a navigation, the window gained or lost focus).
 function presence(url,space,title=''){const t=now();roll(t);const host=focused&&space!=='private'?hostOf(url):'';if(open&&open.host===host){if(!open.title&&title)open.title=String(title).slice(0,120);return;}close(t);if(host)open={from:t,host,...(title?{title:String(title).slice(0,120)}:{})};}
 function focus(on,url,space,title){focused=!!on;presence(on?url:'',space,title);}
 // The set of open tabs changed; a burst of changes within a minute is recorded once.
 function moment(tabs){const t=now();roll(t);const list=tabs.filter(x=>x.space!=='private'&&/^https?:\/\//.test(x.url||'')).slice(0,MAX_TABS).map(x=>({url:x.url,title:String(x.customTitle||x.title||'').slice(0,200),space:x.space}));
  const last=data.moments.at(-1),key=JSON.stringify(list.map(x=>x.url));if(last&&JSON.stringify(last.tabs.map(x=>x.url))===key)return;
  if(last&&t-last.at<MOMENT_GAP)data.moments.pop();if(list.length)data.moments.push({at:t,tabs:list});if(data.moments.length>MAX_MOMENTS)data.moments.shift();changed();}
 function segmentsNow(t){return [...data.segments,...(open&&t-open.from>=1000?[{...open,to:t}]:[])];}
 // Sites you usually open around this hour (this hour counts most, its neighbours half), leaving out what is open.
 function usual({openHosts=[],limit=3}={}){const t=new Date(now()),weekend=t.getDay()===0||t.getDay()===6,h=t.getHours(),base=weekend?24:0,skip=new Set(openHosts.map(x=>String(x).replace(/^www\./,'')));
  return Object.entries(data.habits||{}).filter(([host])=>!skip.has(host)).map(([host,row])=>({host,score:row[base+h]+.5*(row[base+(h+23)%24]+row[base+(h+1)%24])})).filter(x=>x.score>=6).sort((a,b)=>b.score-a.score).slice(0,limit).map(({host,score})=>({host,url:'https://'+host+'/',minutes:Math.round(score)}));}
 // A chapter key changes when a chapter starts or a new one begins, so AI titles are asked for only then.
 function chapterKey(chapters){return chapters.map(c=>c.from+':'+c.sites.slice(0,3).map(s=>s.host).join(',')).join('|');}
 function chapters(){return chaptersOf(segmentsNow(now()));}
 function setInsights(key,value){insights={key,titles:Array.isArray(value?.titles)?value.titles:[],summary:value?.summary||''};revision++;}
 function view(options={}){const t=now();roll(t);const segments=segmentsNow(t),list=chaptersOf(segments),key=chapterKey(list),fresh=insights&&insights.key===key;
  // Titles from an older chapter list still fit the chapters that have not changed since.
  const titles=insights?insights.titles:[];
  return {day:data.day,now:t,segments:segments.map(({from,to,host})=>({from,to,host})),moments:data.moments.map(m=>({at:m.at,count:m.tabs.length})),
   chapters:list.map((c,i)=>({from:c.from,to:c.to,active:c.active,kind:c.kind,sites:c.sites,title:titles[i]||''})),summary:fresh?insights.summary:'',insightsKey:key,insightsFresh:!!fresh,
   active:list.reduce((n,c)=>n+c.active,0),usual:options.usual===false?[]:usual(options)};}
 function at(time,space){const list=data.moments.filter(m=>m.at<=time);const m=list.at(-1)||data.moments[0];return m?{at:m.at,tabs:m.tabs.filter(x=>!space||x.space===space)}:null;}
 function flush(){clearTimeout(saveTimer);close(now());save(data);}
 return {presence,focus,moment,view,at,flush,chapters,chapterKey,setInsights,usual,revision:()=>revision};
}
module.exports={createSpectrum,hostOf,dayKey,normalize,kindOf,chaptersOf};

// Spectrum (0.32): today as a band of light at the foot of the sidebar. Each stripe is the site you were looking at,
// coloured by the site, so a day reads like light through a prism. Prism also notes which tabs were open whenever that
// set changes; scrubbing the band to any moment can bring that set back, asleep. Only today is kept, on this Mac, and
// never anything from Private. Time spent away from Prism's window leaves a gap.
const MIN_SEGMENT=15000,MOMENT_GAP=60000,MAX_SEGMENTS=1500,MAX_MOMENTS=240,MAX_TABS=60;
const dayKey=time=>{const d=new Date(time);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
function hostOf(url){try{const u=new URL(url);return /^https?:$/.test(u.protocol)?u.hostname.replace(/^www\./,''):'';}catch{return '';}}
function normalize(raw,now){
 const day=dayKey(now);if(!raw||raw.day!==day)return {day,segments:[],moments:[]};
 const segments=(Array.isArray(raw.segments)?raw.segments:[]).filter(s=>Number.isFinite(s?.from)&&Number.isFinite(s?.to)&&s.to>=s.from&&typeof s.host==='string'&&s.host.length<=253).map(s=>({from:s.from,to:s.to,host:s.host})).slice(-MAX_SEGMENTS);
 const moments=(Array.isArray(raw.moments)?raw.moments:[]).filter(m=>Number.isFinite(m?.at)&&Array.isArray(m.tabs)).map(m=>({at:m.at,tabs:m.tabs.filter(t=>/^https?:\/\//.test(t?.url||'')&&typeof t.space==='string'&&t.space!=='private').slice(0,MAX_TABS).map(t=>({url:String(t.url).slice(0,4096),title:String(t.title||'').slice(0,200),space:t.space}))})).slice(-MAX_MOMENTS);
 return {day,segments,moments};
}
function createSpectrum({load=()=>null,save=()=>{},now=Date.now}={}){
 let data=normalize(load(),now()),open=null,focused=true,revision=0,saveTimer=null;
 const changed=()=>{revision++;clearTimeout(saveTimer);saveTimer=setTimeout(()=>save(data),10000);saveTimer.unref?.();};
 function roll(t){if(data.day!==dayKey(t)){close(t);data={day:dayKey(t),segments:[],moments:[]};changed();}}
 function close(t){if(!open)return;const seg={...open,to:t};open=null;if(seg.to-seg.from<MIN_SEGMENT)return;const last=data.segments.at(-1);
  if(last&&last.host===seg.host&&seg.from-last.to<MIN_SEGMENT)last.to=seg.to;else data.segments.push(seg);if(data.segments.length>MAX_SEGMENTS)data.segments.shift();changed();}
 // The page in front changed (another tab, a navigation, the window gained or lost focus).
 function presence(url,space){const t=now();roll(t);const host=focused&&space!=='private'?hostOf(url):'';if(open&&open.host===host)return;close(t);if(host)open={from:t,host};}
 function focus(on,url,space){focused=!!on;presence(on?url:'',space);}
 // The set of open tabs changed; a burst of changes within a minute is recorded once.
 function moment(tabs){const t=now();roll(t);const list=tabs.filter(x=>x.space!=='private'&&/^https?:\/\//.test(x.url||'')).slice(0,MAX_TABS).map(x=>({url:x.url,title:String(x.customTitle||x.title||'').slice(0,200),space:x.space}));
  const last=data.moments.at(-1),key=JSON.stringify(list.map(x=>x.url));if(last&&JSON.stringify(last.tabs.map(x=>x.url))===key)return;
  if(last&&t-last.at<MOMENT_GAP)data.moments.pop();if(list.length)data.moments.push({at:t,tabs:list});if(data.moments.length>MAX_MOMENTS)data.moments.shift();changed();}
 function view(){const t=now();roll(t);const segments=[...data.segments,...(open&&t-open.from>=1000?[{...open,to:t}]:[])];return {day:data.day,now:t,segments,moments:data.moments.map(m=>({at:m.at,count:m.tabs.length}))};}
 function at(time,space){const list=data.moments.filter(m=>m.at<=time);const m=list.at(-1)||data.moments[0];return m?{at:m.at,tabs:m.tabs.filter(x=>!space||x.space===space)}:null;}
 function flush(){clearTimeout(saveTimer);close(now());save(data);}
 return {presence,focus,moment,view,at,flush,revision:()=>revision+(open?1:0)*0};
}
module.exports={createSpectrum,hostOf,dayKey,normalize};

// Spaces: Private is built in and always last; the others belong to the user (up to 40), each with a name, one of
// 40 icons (space-icons.js) and a colour. The colour is '' (the theme's accent), a theme preset ("preset:Glacier",
// drawn in that preset's light or dark accent) or a custom "#rrggbb". Personal and Work are the starting two.
const {prismPresets}=require('./theme-presets.js');
const PRIVATE='private',MAX_SPACES=40;
const ICONS=['person','briefcase','house','star','heart','bolt','leaf','flame','moon','sun','cloud','drop','globe','plane','car','map','book','pencil','code','terminal','flask','palette','camera','film','music','headphones','game','cart','gift','coffee','fork','dumbbell','paw','flower','mountain','wave','rocket','graduation','money','chat'];
const DEFAULTS=[{id:'personal',name:'Personal',icon:'person',color:''},{id:'work',name:'Work',icon:'briefcase',color:''}];
const ID=/^[a-z0-9][a-z0-9-]{0,39}$/;
const presetNames=prismPresets.map(p=>p.name);
function color(value){if(typeof value!=='string')return '';if(/^#[0-9a-f]{6}$/i.test(value))return value.toLowerCase();const m=/^preset:(.+)$/.exec(value);return m&&presetNames.includes(m[1])?value:'';}
const name=value=>String(value??'').replace(/\s+/g,' ').trim().slice(0,32);
function space(item){return {id:item.id,name:name(item.name)||'Space',icon:ICONS.includes(item.icon)?item.icon:'star',color:color(item.color)};}
function normalizeSpaces(list){const out=[],ids=new Set();
 for(const item of Array.isArray(list)?list:[]){if(!item||typeof item!=='object'||!ID.test(item.id)||item.id===PRIVATE||ids.has(item.id))continue;ids.add(item.id);out.push(space(item));if(out.length>=MAX_SPACES)break;}
 return out.length?out:DEFAULTS.map(s=>({...s}));}
const validSpace=(spaces,id)=>id===PRIVATE||spaces.some(s=>s.id===id);
const fallbackSpace=spaces=>spaces[0]?.id||'personal';
function nextName(spaces){for(let n=spaces.length+1;;n++)if(!spaces.some(s=>s.name==='Space '+n))return 'Space '+n;}
function addSpace(spaces,input={},random=()=>Math.random().toString(36).slice(2,10)){
 if(spaces.length>=MAX_SPACES)throw Error(`You can have up to ${MAX_SPACES} spaces.`);
 let id;do id='s-'+random();while(!ID.test(id)||spaces.some(s=>s.id===id));
 const used=new Set(spaces.map(s=>s.icon)),created=space({id,name:name(input.name)||nextName(spaces),icon:input.icon||ICONS.find(i=>!used.has(i)),color:input.color});
 return {spaces:[...spaces,created],space:created};}
function updateSpace(spaces,id,patch={}){const i=spaces.findIndex(s=>s.id===id);if(i<0)throw Error('That space no longer exists.');
 const s=spaces[i],next=space({...s,...('name' in patch?{name:name(patch.name)||s.name}:{}),...('icon' in patch&&ICONS.includes(patch.icon)?{icon:patch.icon}:{}),...('color' in patch?{color:patch.color}:{})});
 return spaces.map((x,k)=>k===i?next:x);}
function removeSpace(spaces,id){if(!spaces.some(s=>s.id===id))throw Error('That space no longer exists.');if(spaces.length<=1)throw Error('Keep at least one space.');return spaces.filter(s=>s.id!==id);}
function moveSpace(spaces,id,beforeId){const from=spaces.findIndex(s=>s.id===id);if(from<0||id===beforeId)return spaces;const next=[...spaces],[item]=next.splice(from,1),to=next.findIndex(s=>s.id===beforeId);next.splice(to<0?next.length:to,0,item);return next;}
function normalTabs(tabs){return tabs.filter(t=>t.space!=='private').map(t=>({url:t.url,title:t.title,keepAwake:t.keepAwake,space:t.space||'personal',pinned:!!t.pinned,...(t.favoriteId?{favoriteId:t.favoriteId}:{})}));}
function inSpace(tab,space){return (tab.space||'personal')===space;}
module.exports={PRIVATE,MAX_SPACES,ICONS,DEFAULTS,ID,normalizeSpaces,validSpace,fallbackSpace,addSpace,updateSpace,removeSpace,moveSpace,spaceColor:color,normalTabs,inSpace};

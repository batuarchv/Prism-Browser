// Tab groups (0.50): drop a tab onto another tab and they become a group, shown in the sidebar under a small header that
// folds. A group is a tag on its tabs (group id + name), saved with the session; there is no separate list to keep in
// step. Groups hold open (unpinned) tabs of one space, always next to each other.
const siteName=url=>{try{const h=new URL(url).hostname.replace(/^www\./,'');if(!h.includes('.')||/^[\d.]+$/.test(h)||h.includes(':'))return h||'Group';const parts=h.split('.');const base=parts.length>2&&parts.at(-2).length<=3?parts.at(-3):parts.at(-2)||h;return base?base[0].toUpperCase()+base.slice(1):'Group';}catch{return 'Group';}};
let counter=0;
const newId=(now=Date.now())=>'g'+now.toString(36)+(counter++).toString(36);
const groupable=t=>!!t&&!t.pinned&&!t.favoriteId;
// Moves `id` to sit right after the last tab of `group` (or after `afterId`).
function placeAfter(tabs,id,afterId){const moving=tabs.find(t=>t.id===id);if(!moving)return tabs;const rest=tabs.filter(t=>t!==moving);const i=rest.findIndex(t=>t.id===afterId);if(i<0)return tabs;rest.splice(i+1,0,moving);return rest;}
function lastOf(tabs,group){let last=null;for(const t of tabs)if(t.group===group)last=t;return last;}
// Drop `id` onto `targetId`: joins the target's group, or makes a new one named after the target's site.
function join(tabs,id,targetId,{makeId=newId}={}){const moving=tabs.find(t=>t.id===id),target=tabs.find(t=>t.id===targetId);
 if(!moving||!target||moving===target||!groupable(moving)||!groupable(target)||moving.space!==target.space)return null;
 if(!target.group){target.group=makeId();target.groupName=siteName(target.url);}
 moving.group=target.group;moving.groupName=target.groupName;
 return normalize(placeAfter(tabs,id,lastOf(tabs.filter(t=>t!==moving),target.group).id));}
function create(tabs,id,{makeId=newId}={}){const t=tabs.find(x=>x.id===id);if(!groupable(t))return null;t.group=makeId();t.groupName=siteName(t.url);return tabs;}
function leave(tabs,id){const t=tabs.find(x=>x.id===id);if(!t?.group)return null;const group=t.group,last=lastOf(tabs,group);t.group='';t.groupName='';return normalize(last&&last!==t?placeAfter(tabs,id,last.id):tabs);}
function rename(tabs,group,name){const clean=String(name||'').trim().slice(0,60);if(!clean)return false;let any=false;for(const t of tabs)if(t.group===group){t.groupName=clean;any=true;}return any;}
function ungroup(tabs,group){for(const t of tabs)if(t.group===group){t.group='';t.groupName='';}return tabs;}
// Keeps groups whole: a member that ended up away from the rest (after a reorder) leaves the group; pinned or favorite
// tabs never stay in one. A group of one keeps its name, so a fresh group can be filled by the next drop.
function normalize(tabs){const seen=new Map();let prev=null;
 for(const t of tabs){if(t.group&&!groupable(t)){t.group='';t.groupName='';}
  if(t.group){if(seen.has(t.group)&&prev?.group!==t.group){t.group='';t.groupName='';}else{if(!seen.has(t.group))seen.set(t.group,t.groupName||'Group');t.groupName=seen.get(t.group);}}
  prev=t;}
 return tabs;}
module.exports={join,create,leave,rename,ungroup,normalize,siteName};

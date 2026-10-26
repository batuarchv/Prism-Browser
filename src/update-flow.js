// Update presentation rules, free of Electron so they are unit-tested (used by main.cjs and the renderer).
(function(root){
 const parse=v=>/^\d+\.\d+\.\d+$/.test(v||'')?v.split('.').map(Number):null;
 function newer(a,b){const x=parse(a),y=parse(b);if(!x||!y)return false;for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i];return false;}
 // What the sidebar footer shows for an updater snapshot: nothing, a quiet download ring, or "Restart to Update".
 function indicator(u){if(!u||!u.configured)return {kind:'none'};if(u.status==='downloading')return {kind:'downloading'};if(u.status==='ready'&&u.version)return {kind:'ready',version:u.version};return {kind:'none'};}
 // "What's new" appears once per version, only after an update: a fresh install (welcome guide not finished) just
 // records the version. Before 0.26 nothing was recorded, so a finished welcome guide with no record means an update.
 function whatsNew({current,seen,onboarded}){
  if(!parse(current))return {show:false,record:null};if(seen===current)return {show:false,record:null};
  if(!onboarded)return {show:false,record:current};
  return {show:!seen||newer(current,seen),record:current};
 }
 const ICONS=[[/memory|lighter/i,'moon'],[/split/i,'sidebar'],[/site controls/i,'shield'],[/spaces?\b/i,'folder'],[/quicker|faster/i,'forward'],[/new tab/i,'plus'],[/close/i,'close'],[/zoom|pinch|look up/i,'search'],[/swipe|step/i,'arrow'],[/panel|side/i,'sidebar'],[/setting/i,'settings'],[/extension/i,'extension'],[/update|install/i,'reload'],[/download/i,'download'],[/password|login|key/i,'key'],[/favorite|bookmark/i,'star'],[/sidebar|corner|tab/i,'sidebar'],[/logo|glass|look|motion|animation/i,'sparkles']];
 // RELEASE-x.md → {version, title, items:[{icon,title,detail}]}: bold lead-ins of the "## New" list, first sentence after.
 function releaseNotes(markdown,version){
  const text=String(markdown||''),heading=text.match(/^#\s+Prism\s+(\d+\.\d+\.\d+)\s*[·—-]\s*(.+)$/m),section=(text.split(/^##\s+New\s*$/m)[1]||'').split(/^##\s/m)[0];
  const items=[];for(const line of section.split('\n')){const m=line.match(/^-\s+\*\*(.+?)\*\*\s*(.*)$/);if(!m)continue;
   const title=m[1].replace(/[.:]\s*$/,'').trim(),rest=m[2].replace(/\*\*/g,'').trim(),detail=(rest.match(/^.*?[.!?](?=\s|$)/)||[rest])[0];
   items.push({icon:(ICONS.find(([re])=>re.test(title))||[,'sparkles'])[1],title:title.slice(0,80),detail:detail.slice(0,160)});}
  const date=(text.match(/<!--\s*date:\s*(\d{4}-\d{2}-\d{2})\s*-->/)||[])[1]||'';
  return {version:heading?.[1]||version||'',title:(heading?.[2]||'').trim(),date,items:items.slice(0,10)};
 }
 const api={newer,indicator,whatsNew,releaseNotes};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PrismUpdateFlow=api;
})(typeof window!=='undefined'?window:globalThis);

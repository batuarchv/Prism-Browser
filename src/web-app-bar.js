// Toolbar of a web app in the Dock: back, forward, reload, the page title and "Open in Prism". When the app has
// left its own site (a sign-in page), the host shows next to the title and Home brings it back.
(()=>{const $=id=>document.getElementById(id);
 const paths={back:'M15 5l-7 7 7 7',forward:'M9 5l7 7-7 7',reload:'M19 12a7 7 0 1 1-2.05-4.95M19 4.5V8h-3.5',stop:'M7 7l10 10M17 7L7 17',home:'M4.5 11L12 4.5l7.5 6.5M6.5 9.5V19h11V9.5',prism:'M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4'};
 const draw=(button,name)=>{const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',paths[name]);svg.append(p);button.replaceChildren(svg);};
 for(const b of document.querySelectorAll('[data-command]')){draw(b,b.dataset.command);b.onclick=()=>window.webApp.command(b.dataset.command);}
 let state={};
 window.webApp.onState(next=>{state={...state,...next};document.documentElement.toggleAttribute('data-dark',!!state.dark);
  if(state.title!==undefined){$('name').textContent=state.title||state.name||'';document.title=state.title||'';}
  let host='';try{host=state.away?new URL(state.url).hostname:'';}catch{}$('host').textContent=host;$('home').hidden=!state.away;
  $('back').disabled=!state.back;$('forward').disabled=!state.forward;document.body.classList.toggle('loading',!!state.loading);
  draw($('reload'),state.loading?'stop':'reload');$('reload').title=$('reload').ariaLabel=state.loading?'Stop':'Reload';});
})();

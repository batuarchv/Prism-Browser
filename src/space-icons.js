// The 40 icons a space can wear (src/spaces.cjs ICONS lists the same names in the same order). Same 24 px grid and
// stroke as icons.js, so they sit next to the rest of the interface.
(function(root){
 const dot=(x,y,r)=>`M${x+r} ${y}a${r} ${r} 0 1 1-${2*r} 0 ${r} ${r} 0 0 1 ${2*r} 0`;
 const paths={
  person:dot(12,8,4)+'M4 21a8 8 0 0 1 16 0',
  briefcase:'M3 8h18v12H3Z M8 8V5h8v3 M3 13h18',
  house:'M3 11 12 4l9 7 M5 10v10h14V10 M10 20v-6h4v6',
  star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z',
  heart:'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z',
  bolt:'M13 2 4 14h7l-1 8 9-12h-7Z',
  leaf:'M5 19C5 10 10 5 20 4c-1 10-6 15-15 15Z M5 19l8-8',
  flame:'M12 21c-4 0-7-3-7-7 0-4 3-6 4-10 2 2 3 4 3 6 1-1 2-2 2-4 2 2 5 5 5 8 0 4-3 7-7 7Z',
  moon:'M20 14a8 8 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z',
  sun:dot(12,12,4)+'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5',
  cloud:'M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18Z',
  drop:'M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z',
  globe:dot(12,12,9)+'M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18',
  plane:'M21 3 3 10l7 3 3 7Z M10 13 21 3',
  car:'M3 16v-4l2-5h14l2 5v4Z M3 12h18 M6 16v3 M18 16v3 M7 14h.01 M17 14h.01',
  map:'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2Z M9 4v14 M15 6v14',
  book:'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4Z M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6Z',
  pencil:'M4 20h4L19 9l-4-4L4 16Z M13 7l4 4',
  code:'m8 7-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16',
  terminal:'M3 4h18v16H3Z M7 9l3 3-3 3 M12 15h5',
  flask:'M9 3h6 M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3 M7 15h10',
  palette:'M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 3 0 4-1 3-2 3-4c0-4-4-8-9-8Z M7.5 11h.01 M10 7.5h.01 M14.5 7.5h.01',
  camera:'M3 8h4l2-3h6l2 3h4v12H3Z'+dot(12,13.5,3.5),
  film:'M4 3h16v18H4Z M8 3v18 M16 3v18 M4 8h4 M4 16h4 M16 8h4 M16 16h4 M4 12h16',
  music:'M9 18V5l11-2v13'+dot(6,18,3)+dot(17,16,3),
  headphones:'M4 15v-3a8 8 0 0 1 16 0v3 M4 15h3v6H4Z M17 15h3v6h-3Z',
  game:'M6 7h12a4 4 0 0 1 4 4l-1 6a2.5 2.5 0 0 1-4.3 1.2L15 16H9l-1.7 2.2A2.5 2.5 0 0 1 3 17l-1-6a4 4 0 0 1 4-4Z M8 10v4 M6 12h4 M15 11h.01 M17 13h.01',
  cart:'M3 4h2l2.5 11h11L21 7H6 M10 20h.01 M17 20h.01',
  gift:'M3 8h18v4H3Z M5 12v9h14v-9 M12 8v13 M12 8C10 4 6 4 7 7c.5 1 5 1 5 1Z M12 8c2-4 6-4 5-1-.5 1-5 1-5 1Z',
  coffee:'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z M17 11h1.5a2.5 2.5 0 0 1 0 5H17 M8 3v3 M12 3v3',
  fork:'M6 3v6a3 3 0 0 0 6 0V3 M9 3v18 M18 21V3c-2 2-3 5-3 9h3',
  dumbbell:'M6 7v10 M18 7v10 M3 9v6 M21 9v6 M6 12h12',
  paw:'M12 12c-3 0-5.5 3-5.5 5.5 0 1.8 1.5 2.5 3 2.5 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.5 0 3-.7 3-2.5C17.5 15 15 12 12 12Z'+dot(5.5,10,1.6)+dot(9,6,1.6)+dot(15,6,1.6)+dot(18.5,10,1.6),
  flower:'M12 21v-9 M12 12c-4 0-6-3-6-7l3 2 3-4 3 4 3-2c0 4-2 7-6 7Z M12 18c-2-2-5-2-6-1 1 2 4 3 6 3 M12 18c2-2 5-2 6-1-1 2-4 3-6 3',
  mountain:'M2 20 9 7l5 8 2-3 6 8Z',
  wave:'M3 7c2-3 4-3 6 0s4 3 6 0 4-3 6 0 M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0 M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0',
  rocket:'M12 2c3 3 4 7 4 11l-2 3h-4l-2-3c0-4 1-8 4-11Z M8 12l-3 3v4l4-2 M16 12l3 3v4l-4-2 M12 19v3'+dot(12,9,1.5),
  graduation:'M2 9l10-5 10 5-10 5Z M6 11v5c3 2 9 2 12 0v-5 M22 9v6',
  money:'M3 6h18v12H3Z'+dot(12,12,3)+'M6 9h.01 M18 15h.01',
  chat:'M4 5h16v11H9l-5 4Z'
 };
 const names=Object.keys(paths);
 function spaceIcon(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('icon','space-glyph');
  const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',(paths[name]||paths.star).replace(/M/g,' M').trim());svg.append(p);return svg;}
 const api={paths,names};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else Object.assign(root,{PrismSpaceIcons:api,spaceIcon});
})(globalThis);

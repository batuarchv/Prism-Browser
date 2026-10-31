// Small pure helpers shared by the browser window and unit tests (loaded as a script in the window, required in tests).
(function(root){
 // Classifies an icon from RGBA pixels: 'dark-mono' or 'light-mono' are one-colour logos on a transparent background,
 // which disappear on a sidebar of the same tone; 'color' and 'opaque' icons are left exactly as drawn.
 function iconTone(data){
  let visible=0,opaque=0,lum=0,chroma=0;const total=data.length/4;
  for(let i=0;i<data.length;i+=4){const a=data[i+3]/255;if(a<0.1)continue;visible++;if(a>0.9)opaque++;const r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255;lum+=0.2126*r+0.7152*g+0.0722*b;chroma+=Math.max(r,g,b)-Math.min(r,g,b);}
  if(!visible||!total)return 'empty';
  if(opaque/total>0.85)return 'opaque';
  const meanLum=lum/visible,meanChroma=chroma/visible;
  if(meanChroma>0.18)return 'color';
  return meanLum<0.3?'dark-mono':meanLum>0.82?'light-mono':'color';
 }
 // Toolbar Extensions lists only loaded extensions that have their own panel (action popup or side panel).
 function panelExtensions(list){return (Array.isArray(list)?list:[]).filter(e=>e&&e.loaded&&(e.hasPopup||e.hasSidePanel));}
 // The toolbar popover lists every turned-on extension (0.43); those without a panel run their own click.
 function toolbarExtensions(list){return (Array.isArray(list)?list:[]).filter(e=>e&&e.loaded);}
 const api={iconTone,panelExtensions,toolbarExtensions};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PrismUI=api;
})(globalThis);

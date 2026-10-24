// The glass Prism logo across the interface. Small logos (sidebar, home, Settings) use the pre-rendered image for the
// current theme (assets/prism-glass*.png, rendered in Blender by scripts/blender/); large ones play the rendered turn frames.
(()=>{
 const src=dark=>`../assets/prism-glass${dark?'-dark':''}.png`,dark=()=>document.documentElement.dataset.theme==='dark';
 function apply(){const s=src(dark());for(const img of document.querySelectorAll('img[data-glass-logo]'))if(img.getAttribute('src')!==s)img.setAttribute('src',s);}
 new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 window.prismGlassLogo={src:()=>src(dark()),apply};
})();

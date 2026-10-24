// Electron 45 (Chromium 156) does not finish loading a hidden WebContentsView until it is shown, so the loadURL and
// loadFile promises of views that stay hidden until needed (Settings and popovers, autofill suggestions) never settled
// and those surfaces never opened. The page is usable once its DOM is ready, so that is what callers wait for now.
function whenUsable(wc,load){return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;resolve();};
 wc.once('dom-ready',finish);wc.once('did-fail-load',finish);Promise.resolve().then(load).then(finish,finish);});}
module.exports={whenUsable};

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function captureThumbnail(tab,{pause=wait}={}){
 const view=tab.view,wc=view?.webContents,url=tab.url,version=tab.navigationVersion;
 const valid=()=>tab.space!=='private'&&tab.view===view&&view?._prismVisible===true&&!wc.isDestroyed()&&!tab.loading&&tab.url===url&&tab.navigationVersion===version;
 if(!valid())return null;
 try{const image=await wc.capturePage();return valid()?image:null;}catch(error){if(!/surface.*(available|capture)/i.test(error.message)||!valid())return null;}
 // A restored macOS view can lack a compositor surface until its geometry changes.
 // Retry once on the still-visible page; never wake hidden pages or disable throttling.
 const bounds=view.getBounds();if(bounds.width<2||bounds.height<2)return null;
 view.setBounds({...bounds,width:bounds.width-1});
 await pause(20);
 if(wc.isDestroyed())return null;
 // Do not overwrite a sidebar/window resize that occurred during the wait.
 const current=view.getBounds();if(current.x!==bounds.x||current.y!==bounds.y||current.width!==bounds.width-1||current.height!==bounds.height)return null;
 view.setBounds(bounds);if(!valid())return null;await pause(100);if(!valid())return null;
 try{const image=await wc.capturePage();return valid()?image:null;}catch{return null;}
}
module.exports={captureThumbnail};

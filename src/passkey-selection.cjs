function passkeyHandler({activeTab,choose}){
 return async(_event,details,callback)=>{let selected;
 try{const tab=activeTab(),wc=tab?.view?.webContents,frame=details.frame;if(!wc||tab.space==='private'||wc.isDestroyed()||frame!==wc.mainFrame)return;const url=wc.getURL(),parsed=new URL(url),rp=details.relyingPartyId;if(parsed.protocol!=='https:'&&!(parsed.protocol==='http:'&&parsed.hostname==='localhost'))return;if(parsed.hostname!==rp&&!parsed.hostname.endsWith('.'+rp))return;const version=tab.navigationVersion,accounts=details.accounts.filter(a=>typeof a.credentialId==='string');if(!accounts.length)return;const id=await choose(parsed.origin,accounts);if(tab!==activeTab()||wc.isDestroyed()||wc.mainFrame!==frame||wc.getURL()!==url||tab.navigationVersion!==version)return;if(accounts.some(a=>a.credentialId===id))selected=id;
 }catch{}finally{callback(selected);}
 };
}
module.exports={passkeyHandler};

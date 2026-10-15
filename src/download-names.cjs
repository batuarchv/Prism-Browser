const fs=require('node:fs'),path=require('node:path');
function extension(name){return /\.tar\.(gz|bz2|xz)$/i.exec(name)?.[0]||path.extname(name);}
function safeName(proposed,original){const ext=extension(original);let stem=String(proposed||'').normalize('NFC').replace(/[\x00-\x1f\x7f-\x9f\u202a-\u202e\u2066-\u2069/\\:*?"<>|]/g,' ').replace(/\s+/g,' ').trim().replace(/^[. ]+|[. ]+$/g,'');if(ext&&stem.toLowerCase().endsWith(ext.toLowerCase()))stem=stem.slice(0,-ext.length);stem=stem.replace(/\.[a-z0-9]{1,8}$/i,'').trim();if(!stem)throw Error('No usable filename was suggested.');return [...stem].slice(0,100).join('')+ext;}
async function renameDownload(record,name){
 if(record.state!=='completed'||!record.path)throw Error('Wait for this download to finish.');
 if(name!==path.basename(name)||safeName(name,record.name)!==name)throw Error('Invalid filename.');
 const old=record.path,info=await fs.promises.lstat(old);if(!info.isFile()||info.isSymbolicLink())throw Error('This download is not a regular file.');
 const target=path.join(path.dirname(old),name);if(target===old)return;
 // A same-directory hard link fails if a target exists, avoiding rename's overwrite behavior.
 await fs.promises.link(old,target);try{await fs.promises.unlink(old);}catch(error){await fs.promises.unlink(target).catch(()=>{});throw error;}
 record.previousName=record.name;record.name=name;record.path=target;
}
module.exports={safeName,renameDownload,extension};

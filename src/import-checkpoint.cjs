const {createHash}=require('node:crypto');
function digest(value){return createHash('sha256').update(JSON.stringify(value)).digest('hex');}
// Caller encrypts the whole checkpoint. Never store credentials in metadata JSON.
async function commitWithUndo({read,write,saveCheckpoint,next}){
 const before=await read();const checkpoint={version:1,before,afterDigest:digest(next),completed:false};
 await saveCheckpoint(checkpoint);
 try{await write(next);}catch(error){await write(before);throw error;}
 checkpoint.completed=true;await saveCheckpoint(checkpoint);
}
async function restoreCheckpoint({read,write,checkpoint}){
 if(!checkpoint?.completed||digest(await read())!==checkpoint.afterDigest)throw Error('Data changed since import. Undo stopped to preserve your changes; the backup is retained.');
 await write(checkpoint.before);
}
module.exports={digest,commitWithUndo,restoreCheckpoint};

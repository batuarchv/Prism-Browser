const {randomUUID,createHash}=require('node:crypto');
const {credential}=require('./password-data.cjs');
const id=e=>createHash('sha256').update(e.origin+'\0'+e.username).digest('hex');
const digest=e=>createHash('sha256').update(JSON.stringify(e)).digest('hex');
function createCredentialManager({read,write,emit,confirmDelete,canMutate=()=>true}){
 let pending=null,editing=null,revision=0;
 const lookup=key=>read().find(e=>id(e)===key);
 function current(token){if(!editing||editing.token!==token||Date.now()>editing.expires)throw Error('Edit expired. Open the login again.');const row=lookup(editing.id);if(!row||digest(row)!==editing.digest)throw Error('This login changed. Open it again before editing.');return row;}
 function available(){if(!canMutate())throw Error('Wait for the password operation to finish.');}
 function changed(){revision++;emit();}
 function cancelPicker(){if(pending){const old=pending;pending=null;old.resolve(null);emit();}}
 return {
  status:()=>({revision,picker:pending?{token:pending.token,origin:pending.origin,accounts:pending.accounts}:null}),
  list:()=>({entries:read().map(e=>({id:id(e),origin:e.origin,username:e.username}))}),
  beginEdit(key){available();const row=lookup(key);if(!row)throw Error('Login no longer exists.');editing={token:randomUUID(),id:key,digest:digest(row),expires:Date.now()+120000};return {token:editing.token,id:key,origin:row.origin,username:row.username};},
  reveal(token){available();return {password:current(token).password};},
  closeEdit(token){if(editing?.token===token)editing=null;},
  update(value){available();const before=current(value?.token);const entry=credential({origin:value.origin,username:value.username,password:value.password===undefined?before.password:value.password});if(!entry)throw Error('Use an HTTPS website and a nonempty password.');const rows=read();if(rows.some(e=>id(e)!==editing.id&&e.origin===entry.origin&&e.username===entry.username))throw Error('That account already exists. Choose a different username or website.');write(rows.map(e=>id(e)===editing.id?entry:e));editing=null;changed();return {message:'Login updated.'};},
  async remove(key){available();const before=lookup(key);if(!before)return;const expected=digest(before);if(!await confirmDelete(before))return;available();const now=lookup(key);if(!now||digest(now)!==expected)throw Error('This login changed. Review it before deleting.');write(read().filter(e=>id(e)!==key));if(editing?.id===key)editing=null;changed();return {message:'Login deleted.'};},
  choose(origin,entries){cancelPicker();return new Promise(resolve=>{pending={token:randomUUID(),origin,accounts:entries.map(e=>({id:id(e),username:e.username})),resolve};emit();});},
  resolvePicker(value){if(!pending||pending.token!==value?.token)return;const old=pending;const chosen=value.id&&old.accounts.some(e=>e.id===value.id)?lookup(value.id):null;pending=null;old.resolve(chosen?.origin===old.origin?chosen:null);emit();},
  cancelPicker,closeManager(){editing=null;cancelPicker();}
 };
}
module.exports={createCredentialManager};

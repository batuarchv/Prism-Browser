// GitHub Releases as an update source. Only transport lives here: every manifest is still verified with the pinned Ed25519 key
// and every archive with its signed size and SHA-256 by local-updater.cjs before anything is installed.
const fs=require('node:fs'),crypto=require('node:crypto');
const hosts=new Set(['github.com','objects.githubusercontent.com','release-assets.githubusercontent.com','github-releases.githubusercontent.com']);
function repositoryOf(value){return typeof value==='string'&&/^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/.test(value)&&!value.includes('..')?value:null;}
// Follows at most five redirects, each over HTTPS to a GitHub release host.
async function request(fetchImpl,url,signal){
 for(let hop=0;hop<6;hop++){
  const u=new URL(url);if(u.protocol!=='https:'||!hosts.has(u.hostname)||u.username||u.password)throw Error('Update host is not allowed.');
  const res=await fetchImpl(u.href,{redirect:'manual',signal,headers:{'User-Agent':'Prism-Updater','Accept':'application/octet-stream'}});
  if([301,302,303,307,308].includes(res.status)){const next=res.headers.get('location');if(!next)throw Error('Redirect without location.');url=new URL(next,u).href;continue;}
  if(res.status!==200||!res.body)throw Error('Update request failed ('+res.status+').');
  return res;
 }
 throw Error('Too many redirects.');
}
async function readCapped(res,max){const declared=Number(res.headers.get('content-length'));if(declared>max)throw Error('Update response is too large.');const chunks=[];let size=0;for await(const chunk of res.body){size+=chunk.length;if(size>max)throw Error('Update response is too large.');chunks.push(Buffer.from(chunk));}return Buffer.concat(chunks);}
function createGitHubSource({repository,fetch:fetchImpl=globalThis.fetch,timeout=15000,downloadTimeout=15*60000}){
 const repo=repositoryOf(repository);if(!repo)throw Error('Invalid GitHub repository.');
 const base='https://github.com/'+repo+'/releases';
 async function manifest(){const res=await request(fetchImpl,base+'/latest/download/latest.json',AbortSignal.timeout(timeout));return JSON.parse((await readCapped(res,8192)).toString('utf8'));}
 // Downloads the exact signed file from its version tag (v<version>), never "latest", and checks size and hash while writing.
 async function download(m,destination){
  const res=await request(fetchImpl,base+'/download/v'+encodeURIComponent(m.version)+'/'+encodeURIComponent(m.file),AbortSignal.timeout(downloadTimeout));
  const declared=Number(res.headers.get('content-length'));if(declared&&declared!==m.size)throw Error('Update size does not match its signature.');
  const hash=crypto.createHash('sha256'),partial=destination+'.part';let size=0;const out=fs.createWriteStream(partial,{mode:0o600});
  try{for await(const chunk of res.body){size+=chunk.length;if(size>m.size)throw Error('Update is larger than signed.');hash.update(chunk);if(!out.write(chunk))await new Promise(r=>out.once('drain',r));}await new Promise((resolve,reject)=>out.end(e=>e?reject(e):resolve()));
   if(size!==m.size||hash.digest('hex')!==m.sha256)throw Error('Update did not match its signature.');await fs.promises.rename(partial,destination);}
  catch(error){out.destroy();await fs.promises.rm(partial,{force:true}).catch(()=>{});throw error;}
 }
 return {repository:repo,manifest,download};
}
module.exports={createGitHubSource,repositoryOf,hosts};

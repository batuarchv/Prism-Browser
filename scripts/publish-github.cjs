// Optional: uploads the already signed local release to GitHub Releases. Runs only from release-local.cjs with --github
// (or PRISM_GITHUB_RELEASE=1). Uses `gh` when installed, otherwise GH_TOKEN/GITHUB_TOKEN; the token is never printed.
// The release is created as a draft, both assets are uploaded, and only then is it published as "latest", so
// releases/latest/download/latest.json never points at an archive that is still uploading.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {digest,verifyManifest,feedDirectory}=require('../src/local-updater.cjs'),config=require('../src/local-update-config.json'),{repositoryOf}=require('../src/github-update-source.cjs');
(async()=>{
 const version=require('../package.json').version,repo=repositoryOf(config.github?.repository);if(!repo)throw Error('Set github.repository in src/local-update-config.json first.');
 const file=`Prism-Electron-${version}.zip`,archive=path.resolve(__dirname,'../..',file),manifestFile=path.join(feedDirectory(config.directory),'latest.json'),notes=path.resolve(__dirname,'..',`RELEASE-${version}.md`);
 // Upload exactly what the local feed published, after re-checking it against the pinned key.
 const envelope=JSON.parse(fs.readFileSync(manifestFile,'utf8')),m=verifyManifest(envelope,config.publicKey,'0.0.0');
 if(!m||m.version!==version||m.file!==file||fs.statSync(archive).size!==m.size||await digest(archive)!==m.sha256)throw Error('Signed manifest does not match the archive for '+version+'.');
 const dmg=path.resolve(__dirname,'../..',`Prism-${version}.dmg`),extra=fs.existsSync(dmg)?[dmg]:[];
 const tag='v'+version,title='Prism '+version,body=fs.existsSync(notes)?fs.readFileSync(notes,'utf8'):title;
 const staging=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'prism-github-release-')),manifestCopy=path.join(staging,'latest.json');fs.writeFileSync(manifestCopy,JSON.stringify(envelope));
 try{
  let gh=null;try{execFileSync('gh',['auth','status'],{stdio:'ignore'});gh='gh';}catch{}
  if(gh){
   const run=args=>execFileSync(gh,args,{stdio:'inherit'});
   run(['release','create',tag,archive,manifestCopy,...extra,'--repo',repo,'--title',title,'--notes-file',fs.existsSync(notes)?notes:'/dev/null','--draft']);
   run(['release','edit',tag,'--repo',repo,'--draft=false','--latest']);
  }else{
   const token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN;if(!token)throw Error('Install and sign in to gh, or set GH_TOKEN, to upload to GitHub.');
   const api=async(url,options={})=>{const res=await fetch(url,{...options,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Prism-Release',...options.headers}});if(!res.ok)throw Error(`GitHub ${options.method||'GET'} ${new URL(url).pathname} failed (${res.status}).`);return res.status===204?null:res.json();};
   const existing=await fetch(`https://api.github.com/repos/${repo}/releases/tags/${tag}`,{headers:{Authorization:'Bearer '+token,'User-Agent':'Prism-Release'}});if(existing.status!==404)throw Error(`Release ${tag} already exists or could not be checked (${existing.status}).`);
   const release=await api(`https://api.github.com/repos/${repo}/releases`,{method:'POST',body:JSON.stringify({tag_name:tag,name:title,body,draft:true})});
   for(const [name,source,type] of [[file,archive,'application/zip'],['latest.json',manifestCopy,'application/json'],...extra.map(p=>[path.basename(p),p,'application/x-apple-diskimage'])]){
    const upload=release.upload_url.replace(/\{.*\}$/,'')+'?name='+encodeURIComponent(name);
    await api(upload,{method:'POST',headers:{'Content-Type':type,'Content-Length':String(fs.statSync(source).size)},body:fs.createReadStream(source),duplex:'half'});
   }
   await api(`https://api.github.com/repos/${repo}/releases/${release.id}`,{method:'PATCH',body:JSON.stringify({draft:false,make_latest:'true'})});
  }
  console.log(`Published ${tag} to https://github.com/${repo}/releases/tag/${tag}`);
 }finally{fs.rmSync(staging,{recursive:true,force:true});}
})().catch(e=>{console.error(e.message);process.exit(1);});

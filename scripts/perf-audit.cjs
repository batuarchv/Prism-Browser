#!/usr/bin/env node
// Performance audit of this checkout (0.40): `node scripts/perf-audit.cjs <label> [--runs 5] [--real] [--skip-full]`.
// 1. Startup: a one-tab session is saved in a test profile, then Prism is launched --runs times and each launch reports
//    when the main process started, the window was ready to show, the sidebar first painted, and the restored tab
//    finished loading (PRISM_AUDIT_MODE=startup); the median is kept.
// 2. The full audit (test/perf-audit-flow.cjs): idle CPU, memory, Energy Impact and wakeups for 1 and 10 tabs, frame
//    times during interactions. 3. With --real, test/real-sites-flow.cjs (needs the internet).
// Every launch uses an isolated test profile; nothing touches the user's own Prism profile. PRISM_AUDIT_APP=<dir or
// .asar> launches that app instead of this checkout (used to compare a packed app.asar).
const {spawn}=require('node:child_process'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{randomUUID}=require('node:crypto');
const root=path.join(__dirname,'..'),electron=require(path.join(root,'node_modules','electron'));
const args=process.argv.slice(2),label=args.find(a=>!a.startsWith('--'))||'audit',runs=Number(args[args.indexOf('--runs')+1])||5;
const outDir=path.join(root,'reports','perf-0.40');fs.mkdirSync(outDir,{recursive:true});
function launch(env,ms){return new Promise(resolve=>{const start=Date.now();
 const child=spawn(electron,[process.env.PRISM_AUDIT_APP||'.','--smoke-test'],{cwd:root,env:{...process.env,...env,PRISM_LAUNCH_T0:String(start)},stdio:['ignore','pipe','pipe'],detached:true});let out='';
 child.stdout.on('data',d=>{out+=d;});child.stderr.on('data',d=>{out+=d;});
 const kill=()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}};const timer=setTimeout(()=>{out+='\nTIMEOUT';kill();},ms);
 child.on('exit',code=>{clearTimeout(timer);setTimeout(kill,500);resolve({code,out,ms:Date.now()-start});});});}
const line=(out,tag)=>{const l=out.split('\n').filter(x=>x.startsWith(tag+' ')).at(-1);return l?l.slice(tag.length+1):null;};
const median=list=>{const s=list.filter(Number.isFinite).sort((a,b)=>a-b);return s.length?s[s.length>>1]:null;};
(async()=>{
 const report={label,date:new Date().toISOString(),version:require(path.join(root,'package.json')).version,machine:{model:os.cpus()[0]?.model,memGiB:Math.round(os.totalmem()/2**30),os:os.release()}};
 const page=`<!doctype html><title>Startup article</title><body style="font:16px/1.5 -apple-system;max-width:680px;margin:40px auto"><h1>Startup</h1>${'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'.repeat(80)}`;
 const server=http.createServer((_q,res)=>{res.setHeader('Content-Type','text/html');res.end(page);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const id=randomUUID(),profile=path.join(os.tmpdir(),'prism-restart-'+id),url='http://127.0.0.1:'+server.address().port+'/';
 if(!args.includes('--no-startup'))try{
  const seed=await launch({PRISM_TEST_FLOW:'perf-audit-flow.cjs',PRISM_AUDIT_MODE:'seed',PRISM_TEST_RESTART_ID:id,PRISM_AUDIT_URL:url},60000);
  if(!line(seed.out,'SEEDED'))throw Error('Seeding the startup session failed:\n'+seed.out.slice(-2000));
  const startups=[];for(let i=0;i<runs;i++){const r=await launch({PRISM_TEST_FLOW:'perf-audit-flow.cjs',PRISM_AUDIT_MODE:'startup',PRISM_TEST_RESTART_ID:id},60000);const s=line(r.out,'STARTUP');startups.push(s?JSON.parse(s):{error:r.out.slice(-500)});console.log('startup',i+1,s);}
  const fields=Object.keys(startups.find(s=>!s.error)||{});report.startup={runs:startups,median:Object.fromEntries(fields.map(k=>[k,median(startups.map(s=>s[k]))]))};
 }finally{server.close();fs.rmSync(profile,{recursive:true,force:true});}
 if(!args.includes('--skip-full')){const file=path.join(os.tmpdir(),'prism-audit-'+id+'.json');const r=await launch({PRISM_TEST_FLOW:'perf-audit-flow.cjs',PRISM_AUDIT_REPORT:file},420000);
  try{Object.assign(report,{audit:JSON.parse(fs.readFileSync(file,'utf8'))});fs.rmSync(file,{force:true});}catch{report.audit={error:r.out.slice(-3000)};}console.log('audit',report.audit.error?'FAILED':'done');}
 if(args.includes('--real')){const r=await launch({PRISM_TEST_FLOW:'real-sites-flow.cjs'},240000);const s=line(r.out,'REAL');report.realSites=s?JSON.parse(s):{error:r.out.slice(-2000)};
  report.realSitesLog=r.out.split('\n').filter(l=>/^(REQS|TABCPU|PROFILE|\d+ms )/.test(l)).slice(0,40);console.log('real',s);}
 const file=path.join(outDir,label+'.json');fs.writeFileSync(file,JSON.stringify(report,null,1));console.log('wrote',path.relative(root,file));process.exit(0);
})().catch(error=>{console.error(error);process.exit(1);});

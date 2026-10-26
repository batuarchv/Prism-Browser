const os=require('node:os'),{execFile}=require('node:child_process');const {budgetCandidates}=require('./performance.cjs');
// Prism's own footprint as a fallback signal (used where macOS's own pressure level cannot be read).
function pressure(metrics,total=os.totalmem()){const bytes=metrics.reduce((sum,p)=>sum+(p.memory?.workingSetSize||0)*1024,0);return bytes>Math.min(2*1024**3,total*.2);}
// macOS's own memory pressure (0.33.2): the level the system uses to warn apps (1 normal, 2 warning, 4 critical) and the
// share of memory it considers available. Prism's footprint alone said "pressure" on an 8 GB Mac as soon as a few
// modern sites were open, so tabs were put to sleep, and reloaded on return, while the Mac had memory to spare.
function readSystemPressure(run=execFile){return new Promise(resolve=>{run('/usr/sbin/sysctl',['-n','kern.memorystatus_vm_pressure_level','kern.memorystatus_level'],{timeout:2000},(error,out)=>{
 if(error)return resolve(null);const [level,available]=String(out).trim().split(/\s+/).map(Number);if(!Number.isFinite(level))return resolve(null);resolve(level>=2||Number.isFinite(available)&&available<20);});});}
// Under pressure, big tabs you have not used for a while go first; a tab used in the last few minutes is worth keeping
// even when it is large, because reloading it is what feels slow.
function rankedCandidates(tabs,activeId,metrics,now=Date.now()){
 const memory=new Map(metrics.map(p=>[p.pid,p.memory?.workingSetSize||0]));const counts=new Map(),pids=new Map();
 for(const t of tabs){try{const pid=t.view?.webContents?.getOSProcessId();if(pid){pids.set(t.id,pid);counts.set(pid,(counts.get(pid)||0)+1);}}catch{}}
 const weight=t=>(memory.get(pids.get(t.id))||0)/(counts.get(pids.get(t.id))||1)*Math.min(1,Math.max(0,now-(t.lastUsed||0))/(30*60000));
 return budgetCandidates(tabs,activeId,now).sort((a,b)=>weight(b)-weight(a)||a.lastUsed-b.lastUsed);
}
function createMemoryManager({app,session,settings,tabs,activeId,sleepTab,systemPressure}){
 let busy=false;
 const underPressure=async()=>{const system=systemPressure?await systemPressure():null;return system===null||system===undefined?pressure(app.getAppMetrics()):system;};
 async function release(limit,automatic=false){let released=0;for(const tab of rankedCandidates(tabs(),activeId(),app.getAppMetrics())){if(released>=limit)break;if(automatic&&released&&!await underPressure())break;if(await sleepTab(tab,true))released++;}return released;}
 return {underPressure,async sweep(){if(busy||!settings.leanMemory||!await underPressure())return;busy=true;try{return await release(4,true);}finally{busy=false;}},async trim(){if(busy)return;busy=true;try{const released=await release(8);await session.clearCache();return released;}finally{busy=false;}}};
}
module.exports={createMemoryManager,pressure,readSystemPressure,rankedCandidates};

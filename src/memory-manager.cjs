const os=require('node:os');const {budgetCandidates}=require('./performance.cjs');
function pressure(metrics,total=os.totalmem()){const bytes=metrics.reduce((sum,p)=>sum+(p.memory?.workingSetSize||0)*1024,0);return bytes>Math.min(2*1024**3,total*.2);}
function rankedCandidates(tabs,activeId,metrics){
 const memory=new Map(metrics.map(p=>[p.pid,p.memory?.workingSetSize||0]));const counts=new Map(),pids=new Map();
 for(const t of tabs){try{const pid=t.view?.webContents?.getOSProcessId();if(pid){pids.set(t.id,pid);counts.set(pid,(counts.get(pid)||0)+1);}}catch{}}
 const weight=t=>(memory.get(pids.get(t.id))||0)/(counts.get(pids.get(t.id))||1);
 return budgetCandidates(tabs,activeId).sort((a,b)=>weight(b)-weight(a)||a.lastUsed-b.lastUsed);
}
function createMemoryManager({app,session,settings,tabs,activeId,sleepTab}){
 let busy=false;
 async function release(limit,automatic=false){let released=0;for(const tab of rankedCandidates(tabs(),activeId(),app.getAppMetrics())){if(released>=limit)break;if(automatic&&released&&!pressure(app.getAppMetrics()))break;if(await sleepTab(tab,true))released++;}return released;}
 return {async sweep(){if(busy||!settings.leanMemory||!pressure(app.getAppMetrics()))return;busy=true;try{return await release(4,true);}finally{busy=false;}},async trim(){if(busy)return;busy=true;try{const released=await release(8);await session.clearCache();return released;}finally{busy=false;}}};
}
module.exports={createMemoryManager,pressure,rankedCandidates};

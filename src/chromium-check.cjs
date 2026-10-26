// Chromium update check (0.34). Each time Prism opens it asks Google which Chrome version is stable on the Mac and asks
// npm which Electron release is newest; Electron is what carries Chromium into Prism. Only when a newer Electron exists
// does it read Electron's release list for that release's Chromium version. Nothing about you or your browsing is sent:
// these are plain requests for public version lists. Prism itself moves to a new Chromium through its own updates.
const STABLE='https://versionhistory.googleapis.com/v1/chrome/platforms/mac/channels/stable/versions?pageSize=1';
const ELECTRON='https://registry.npmjs.org/-/package/electron/dist-tags';
const RELEASES='https://releases.electronjs.org/releases.json';
const VERSION=/^\d+(\.\d+){1,3}$/;
function compare(a,b){const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d>0?1:-1;}return 0;}
async function readJSON(fetcher,url,limit){const response=await fetcher(url,{signal:AbortSignal.timeout(10000),headers:{Accept:'application/json'}});if(!response.ok)throw Error('HTTP '+response.status);const text=await response.text();if(text.length>limit)throw Error('Too large');return JSON.parse(text);}
function createChromiumCheck({versions=process.versions,fetcher=fetch,changed=()=>{},now=Date.now}={}){
 const state={status:'idle',chromium:versions.chrome,electron:versions.electron,chrome:null,nextElectron:null,nextChromium:null,checkedAt:null};
 let running=null;
 async function run(){
  state.status='checking';changed();
  try{
   const [chrome,tags]=await Promise.all([readJSON(fetcher,STABLE,64*1024),readJSON(fetcher,ELECTRON,256*1024)]);
   const stable=chrome?.versions?.[0]?.version,latest=tags?.latest;
   state.chrome=VERSION.test(stable||'')?stable:null;state.nextElectron=null;state.nextChromium=null;
   if(VERSION.test(latest||'')&&compare(latest,versions.electron)>0){
    state.nextElectron=latest;
    try{const release=(await readJSON(fetcher,RELEASES,8*1024*1024)).find(r=>r?.version===latest);if(VERSION.test(release?.chrome||''))state.nextChromium=release.chrome;}catch{}
   }
   // "available": an Electron release with a newer Chromium is out, so a Prism update can bring it. "behind": Chrome
   // has moved on but Electron has not caught up yet. "current": Prism has the newest Chromium Electron offers.
   state.status=state.nextElectron&&(!state.nextChromium||compare(state.nextChromium,versions.chrome)>0)?'available':state.chrome&&compare(state.chrome,versions.chrome)>0?'behind':'current';
   state.checkedAt=now();
  }catch{state.status='error';state.checkedAt=now();}
  changed();return snapshot();
 }
 function check(){if(!running)running=run().finally(()=>{running=null;});return running;}
 function snapshot(){return {...state};}
 return {check,snapshot};
}
module.exports={createChromiumCheck,compare};

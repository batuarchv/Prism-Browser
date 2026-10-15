const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const {createRequire}=require('node:module');const {execFileSync}=require('node:child_process');
require('./prepare-extensions.cjs');
(async()=>{
  const root=path.resolve(__dirname,'..');const stage=fs.mkdtempSync(path.join(os.tmpdir(),'prism-package-'));const manifest=require('../package.json');const resolve=createRequire(path.join(root,'package.json'));const copied=new Set();
  try{
  function copyDependency(name,from=resolve){
    if(copied.has(name))return;copied.add(name);
    let resolved;try{resolved=from.resolve(name);}catch{resolved=from.resolve(name+'/package.json');}let dir=path.dirname(resolved);
    while(!fs.existsSync(path.join(dir,'package.json'))||JSON.parse(fs.readFileSync(path.join(dir,'package.json'))).name!==name){const parent=path.dirname(dir);if(parent===dir)throw Error('Cannot locate '+name);dir=parent;}
    fs.cpSync(dir,path.join(stage,'node_modules',name),{recursive:true,filter:p=>!path.relative(dir,p).split(path.sep).includes('node_modules')&&!/\.(map|d\.ts)$/.test(p)});
    const pkg=JSON.parse(fs.readFileSync(path.join(dir,'package.json')));const local=createRequire(path.join(dir,'package.json'));
    for(const dep of Object.keys(pkg.dependencies||{}))copyDependency(dep,local);
  }
  for(const name of Object.keys(manifest.dependencies))copyDependency(name);
  for(const name of ['src','assets','LICENSE','THIRD-PARTY-NOTICES.md'])fs.cpSync(path.join(root,name),path.join(stage,name),{recursive:true,filter:p=>!p.includes('Prism.iconset')&&!/assets\/blocker\/.*\.txt$/.test(p)});
  delete manifest.devDependencies;fs.writeFileSync(path.join(stage,'package.json'),JSON.stringify(manifest,null,2));
  const {packager}=await import('@electron/packager');
  const electronVersion=require('electron/package.json').version;
  let electronZipDir=process.env.PRISM_ELECTRON_ZIP_DIR;
  if(!electronZipDir&&process.platform==='darwin'){
    const electronApp=path.join(path.dirname(resolve.resolve('electron/package.json')),'dist','Electron.app');
    if(fs.existsSync(path.join(electronApp,'Contents','Info.plist'))){
      electronZipDir=path.join(stage,'electron-cache');fs.mkdirSync(electronZipDir,{recursive:true});
      const archive=path.join(electronZipDir,`electron-v${electronVersion}-darwin-arm64.zip`);
      execFileSync('/usr/bin/ditto',['-c','-k','--sequesterRsrc','--keepParent',electronApp,archive],{stdio:'inherit'});
    }
  }
  const result=await packager({dir:stage,name:'Prism',platform:'darwin',arch:'arm64',electronVersion,out:process.env.PRISM_PACKAGE_OUT||path.join(root,'dist'),overwrite:true,prune:false,extraResource:[path.join(root,'src/native/prism-ai')],icon:path.join(root,'assets','Prism-current.icns'),appBundleId:'local.prism.browser',protocols:[{name:'Web links',schemes:['http','https']},{name:'Prism assistant actions',schemes:['prism']}],extendInfo:{NSCameraUsageDescription:'Sites you allow can use your camera.',NSMicrophoneUsageDescription:'Sites you allow can use your microphone.',NSLocationWhenInUseUsageDescription:'Sites you allow can request your location.'},...(electronZipDir?{electronZipDir}:{})});
  console.log(result.join('\n'));
  }finally{fs.rmSync(stage,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exit(1);});

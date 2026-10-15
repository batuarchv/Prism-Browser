const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),stage=fs.mkdtempSync(path.join(os.tmpdir(),'prism-local-release-'));
const run=(exe,args,extra={})=>execFileSync(exe,args,{cwd:root,stdio:'inherit',...extra});
run(process.execPath,['scripts/package.cjs'],{env:{...process.env,PRISM_PACKAGE_OUT:stage}});
const bundle=path.join(stage,'Prism-darwin-arm64/Prism.app');run('/usr/bin/xattr',['-cr',bundle]);run('/usr/bin/codesign',['--force','--deep','--sign','-',bundle]);run('/usr/bin/codesign',['--verify','--deep','--strict',bundle]);
const version=require('../package.json').version,archive=path.resolve(root,'../Prism-Electron-'+version+'.zip');run('/usr/bin/ditto',['-c','-k','--norsrc','--noextattr','--keepParent',bundle,archive]);run(process.execPath,['scripts/publish-local.cjs']);console.log('Signed bundle: '+bundle);

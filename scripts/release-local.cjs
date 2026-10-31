const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),mac=require('./sign-mac.cjs');
const root=path.resolve(__dirname,'..'),stage=fs.mkdtempSync(path.join(os.tmpdir(),'prism-local-release-'));
const run=(exe,args,extra={})=>execFileSync(exe,args,{cwd:root,stdio:'inherit',...extra});
(async()=>{
run(process.execPath,['scripts/package.cjs'],{env:{...process.env,PRISM_PACKAGE_OUT:stage}});
// With a Developer ID certificate in the keychain the app is signed, notarized and stapled (scripts/sign-mac.cjs);
// without one it stays ad-hoc signed, and macOS warns on first open.
const bundle=path.join(stage,'Prism-darwin-arm64/Prism.app'),identity=mac.identity();run('/usr/bin/xattr',['-cr',bundle]);
if(identity)await mac.signApp(bundle,identity);else{console.warn('No Developer ID certificate found: ad-hoc signing (not notarized).');run('/usr/bin/codesign',['--force','--deep','--sign','-',bundle]);run('/usr/bin/codesign',['--verify','--deep','--strict',bundle]);}
const version=require('../package.json').version,archive=path.resolve(root,'../Prism-Electron-'+version+'.zip');run('/usr/bin/ditto',['-c','-k','--norsrc','--noextattr','--keepParent',bundle,archive]);run(process.execPath,['scripts/publish-local.cjs']);
if(process.argv.includes('--dmg')){run(process.execPath,['scripts/build-dmg.cjs',bundle]);if(identity)mac.signDmg(path.resolve(root,'..',`Prism-${version}.dmg`),identity);}
if(process.argv.includes('--github')||process.env.PRISM_GITHUB_RELEASE==='1')run(process.execPath,['scripts/publish-github.cjs']);console.log((identity?'Notarized':'Ad-hoc signed')+' bundle: '+bundle);
})().catch(error=>{console.error(error.message||error);process.exit(1);});

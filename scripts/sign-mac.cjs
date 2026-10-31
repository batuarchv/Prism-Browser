// Developer ID signing and Apple notarization for release-local.cjs. Used only when this Mac's keychain holds a
// "Developer ID Application" certificate (or PRISM_SIGN_IDENTITY names one); otherwise releases stay ad-hoc signed.
// Notarization reads Apple credentials from a notarytool keychain profile, so no password ever enters the repo:
//   xcrun notarytool store-credentials prism-notary --apple-id <email> --team-id <TEAMID> --password <app-specific password>
// PRISM_NOTARY_PROFILE picks another profile name. Check the setup with: node scripts/sign-mac.cjs --check
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),{createRequire}=require('node:module'),{execFileSync}=require('node:child_process');
const entitlements=path.join(__dirname,'mac/entitlements.plist'),profile=process.env.PRISM_NOTARY_PROFILE||'prism-notary';
const run=(exe,args)=>execFileSync(exe,args,{stdio:'inherit'});
// Both helpers ship with @electron/packager; pnpm keeps them out of the top-level node_modules.
const load=name=>import(pathToFileURL(createRequire(path.join(fs.realpathSync(path.join(__dirname,'../node_modules/@electron/packager')),'package.json')).resolve(name)).href);

function identity(){
 if(process.env.PRISM_SIGN_IDENTITY)return process.env.PRISM_SIGN_IDENTITY;
 let list='';try{list=execFileSync('/usr/bin/security',['find-identity','-v','-p','codesigning'],{encoding:'utf8'});}catch{}
 return list.match(/"(Developer ID Application: [^"]+)"/)?.[1]||null;
}

// Signs every nested binary (helpers, frameworks, glass.node, tpws, prism-ai) with the hardened runtime, then
// notarizes and staples the app. Fails the release rather than shipping a signed but un-notarized build.
async function signApp(bundle,name){
 const {sign}=await load('@electron/osx-sign'),{notarize}=await load('@electron/notarize');
 await sign({app:bundle,identity:name,platform:'darwin',optionsForFile:()=>({hardenedRuntime:true,entitlements})});
 run('/usr/bin/codesign',['--verify','--deep','--strict',bundle]);
 console.log('Notarizing Prism.app (usually a few minutes)…');
 await notarize({appPath:bundle,keychainProfile:profile});
 run('/usr/sbin/spctl',['--assess','--type','execute','--verbose',bundle]);
}

function signDmg(dmg,name){
 run('/usr/bin/codesign',['--force','--timestamp','--sign',name,dmg]);
 console.log('Notarizing the DMG…');
 run('/usr/bin/xcrun',['notarytool','submit',dmg,'--keychain-profile',profile,'--wait']);
 run('/usr/bin/xcrun',['stapler','staple',dmg]);
 run('/usr/sbin/spctl',['--assess','--type','open','--context','context:primary-signature','--verbose',dmg]);
}

module.exports={identity,signApp,signDmg};

if(require.main===module&&process.argv.includes('--check')){
 const name=identity();
 console.log(name?'Signing identity: '+name:'No "Developer ID Application" certificate in the keychain. Create one at developer.apple.com → Certificates.');
 try{execFileSync('/usr/bin/xcrun',['notarytool','history','--keychain-profile',profile],{stdio:'ignore'});console.log('Notary profile "'+profile+'": OK');}
 catch{console.log('Notary profile "'+profile+'" missing or rejected. Run: xcrun notarytool store-credentials '+profile+' --apple-id <email> --team-id <TEAMID> --password <app-specific password>');process.exitCode=1;}
 if(!name)process.exitCode=1;
}

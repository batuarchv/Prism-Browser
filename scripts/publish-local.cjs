// Run after packaging and signing. A private key never enters the app or source archive.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {digest}=require('../src/local-updater.cjs'),config=require('../src/local-update-config.json');
(async()=>{const version=require('../package.json').version,file=`Prism-Electron-${version}.zip`,archive=path.resolve(__dirname,'../..',file),keyFile=path.resolve(__dirname,'../../../.prism-release-key.pem');
const key=fs.readFileSync(keyFile);if(crypto.createPublicKey(key).export({type:'spki',format:'pem'})!==config.publicKey)throw Error('Release key does not match the installed trust key.');
const size=fs.statSync(archive).size,sha256=await digest(archive);fs.mkdirSync(config.directory,{recursive:true});const destination=path.join(config.directory,file);fs.copyFileSync(archive,destination+'.tmp');if(await digest(destination+'.tmp')!==sha256)throw Error('Release copy failed.');fs.renameSync(destination+'.tmp',destination);
const payload=JSON.stringify({version,file,size,sha256,bundleID:'local.prism.browser',arch:'arm64'}),signature=crypto.sign(null,Buffer.from(payload),key).toString('base64');fs.writeFileSync(path.join(config.directory,'latest.json.tmp'),JSON.stringify({payload,signature}),{mode:0o600});fs.renameSync(path.join(config.directory,'latest.json.tmp'),path.join(config.directory,'latest.json'));console.log('Published local beta '+version);
})().catch(e=>{console.error(e.message);process.exit(1);});

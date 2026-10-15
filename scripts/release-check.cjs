// Fail closed: publishing is a separate, signed-release step, never ordinary packaging.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const config=require('../src/update-config.json'),{validFeed,verifySignature}=require('../src/updater.cjs');
const bundle=process.argv[2];
if(!bundle||!config.enabled||!validFeed(config.feedURL)||!config.teamID)throw Error('Configure an HTTPS beta feed and Apple Team ID, then pass the signed .app path.');
const absolute=path.resolve(bundle),exe=path.join(absolute,'Contents/MacOS/Prism');
if(!verifySignature({isPackaged:true,getPath:()=>exe},config.teamID))throw Error('A valid Developer ID signature matching the configured team is required.');
execFileSync('/usr/bin/xcrun',['stapler','validate',absolute],{stdio:'inherit'});
const version=execFileSync('/usr/libexec/PlistBuddy',['-c','Print :CFBundleShortVersionString',path.join(absolute,'Contents/Info.plist')],{encoding:'utf8'}).trim();
if(version!==require('../package.json').version)throw Error('Bundle/source version mismatch.');
console.log('Signing, notarization and version checks passed. Upload the release archive and test the Squirrel.Mac JSON feed on a separate installation before publishing.');

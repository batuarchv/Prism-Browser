// Optional installer image: node scripts/build-dmg.cjs <path/to/Prism.app> [output.dmg] [--no-layout]
// Builds a drag-to-Applications DMG with a designed background. Arranging the Finder window uses AppleScript,
// which macOS asks permission for once (Automation → Finder); --no-layout skips it and keeps Finder's default view.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),version=require('../package.json').version;
const args=process.argv.slice(2),layout=!args.includes('--no-layout'),[bundle,output=path.resolve(root,'..',`Prism-${version}.dmg`)]=args.filter(a=>!a.startsWith('--'));
if(!bundle||path.basename(bundle)!=='Prism.app'||!fs.existsSync(path.join(bundle,'Contents/Info.plist')))throw Error('Pass the built Prism.app.');
const run=(exe,list,opts={})=>execFileSync(exe,list,{stdio:['ignore','pipe','inherit'],...opts}).toString();
const work=fs.mkdtempSync(path.join(os.tmpdir(),'prism-dmg-')),stage=path.join(work,'stage'),art=path.join(work,'art'),volume=`Prism ${version}`;
try{
 fs.mkdirSync(path.join(stage,'.background'),{recursive:true});fs.mkdirSync(art);
 run(require('electron'),[path.join(__dirname,'dmg/render-background.cjs'),art]);
 // One HiDPI TIFF holds both sizes so the background stays sharp on Retina displays.
 run('/usr/bin/tiffutil',['-cathidpicheck',path.join(art,'background.png'),path.join(art,'background@2x.png'),'-out',path.join(stage,'.background/background.tiff')]);
 run('/usr/bin/ditto',[bundle,path.join(stage,'Prism.app')]);fs.symlinkSync('/Applications',path.join(stage,'Applications'));
 const rw=path.join(work,'rw.dmg');run('/usr/bin/hdiutil',['create','-volname',volume,'-srcfolder',stage,'-fs','HFS+','-format','UDRW','-ov',rw]);
 if(layout){
  const mount=run('/usr/bin/hdiutil',['attach','-readwrite','-noverify','-noautoopen',rw]).split('\n').map(l=>l.split('\t').at(-1).trim()).find(p=>p.startsWith('/Volumes/'));
  try{
   const script=`tell application "Finder"
 tell disk "${path.basename(mount).replace(/"/g,'')}"
  open
  set w to container window
  set current view of w to icon view
  set toolbar visible of w to false
  set statusbar visible of w to false
  set bounds of w to {200, 140, 860, 560}
  set o to icon view options of w
  set arrangement of o to not arranged
  set icon size of o to 112
  set text size of o to 13
  set background picture of o to file ".background:background.tiff"
  set position of item "Prism.app" of w to {170, 214}
  set position of item "Applications" of w to {490, 214}
  update without registering applications
  delay 1
  close
 end tell
end tell`;
   // If Finder automation is declined or times out, ship the DMG with Finder's default view rather than failing the release.
   try{run('/usr/bin/osascript',['-e',script],{timeout:120000});}catch{console.warn('Finder layout skipped: allow Automation → Finder for this terminal to arrange the window.');}run('/bin/sync',[]);
  }finally{run('/usr/bin/hdiutil',['detach',mount,'-quiet']);}
 }
 fs.rmSync(output,{force:true});run('/usr/bin/hdiutil',['convert',rw,'-format','UDZO','-imagekey','zlib-level=9','-o',output]);
 run('/usr/bin/hdiutil',['verify',output]);console.log('DMG: '+output);
}finally{fs.rmSync(work,{recursive:true,force:true});}

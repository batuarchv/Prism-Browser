// Builds the bypass helper (src/native/tpws) from Zapret's tpws source in vendor/zapret-tpws (MIT, bol-van).
// Prism ships it so the bypass works without installing anything (0.39). Needs the Xcode command line tools.
const {execFileSync}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),src=path.join(root,'vendor','zapret-tpws'),out=path.join(root,'src','native','tpws');
const files=[...fs.readdirSync(src).filter(f=>f.endsWith('.c')),...fs.readdirSync(path.join(src,'epoll-shim','src')).filter(f=>f.endsWith('.c')).map(f=>path.join('epoll-shim','src',f))];
execFileSync('cc',['-std=gnu99','-Os','-Wno-address-of-packed-member','-Iepoll-shim/include','-Imacos','-target','arm64-apple-macos12','-o',out,...files,'-lz','-lpthread','-Wl,-dead_strip'],{cwd:src,stdio:'inherit'});
execFileSync('strip',[out]);fs.copyFileSync(path.join(src,'LICENSE.txt'),path.join(root,'src','native','ZAPRET-LICENSE'));
console.log('Built',out);

const fs=require('node:fs');
// The published development preload logs extension IPC arguments/results.
// Disable those three debug branches so credential payloads cannot enter logs.
const file=require.resolve('electron-chrome-extensions/preload');const source=fs.readFileSync(file,'utf8');const matches=source.match(/if \(true\) \{\s*console\.log/g)||[];if(matches.length&&matches.length!==3)throw Error('Review extension preload logging after dependency upgrade.');fs.writeFileSync(file,source.replace(/if \(true\) \{(?=\s*console\.log)/g,'if (false) {'));

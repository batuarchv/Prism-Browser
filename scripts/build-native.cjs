const {execFileSync}=require('node:child_process');const path=require('node:path');
const root=path.resolve(__dirname,'..');const include=path.join(path.dirname(require.resolve('node-api-headers/package.json')),'include');
execFileSync('xcrun',['clang++','-std=c++17','-fobjc-arc','-dynamiclib','-undefined','dynamic_lookup','-mmacosx-version-min=13.0','-framework','AppKit','-framework','QuartzCore','-I'+include,path.join(root,'src/native/glass.mm'),'-o',path.join(root,'src/native/glass.node')],{stdio:'inherit'});

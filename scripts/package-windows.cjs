// Prism for Windows (Windows build, 0.50): builds the x64 installer (NSIS, per-user, can pick a folder) with electron-builder.
// Runs on Windows (the GitHub Actions workflow in .github/workflows/windows.yml), after `npm install` and
// `npm install --no-save electron-builder`. The Mac-only helpers in src/native (Liquid Glass, Apple Intelligence,
// the tpws bypass) are left out; the app falls back to solid surfaces and a direct connection without them.
// Output: dist/windows/Prism-<version>-Windows-x64-Setup.exe
const path=require('node:path');
require('./prepare-extensions.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..');const {build,Platform}=require('electron-builder');
 const electronDist=path.join(path.dirname(require.resolve('electron/package.json',{paths:[root]})),'dist');
 const result=await build({projectDir:root,targets:Platform.WINDOWS.createTarget(['nsis'],require('electron-builder').Arch.x64),publish:'never',config:{
  appId:'local.prism.browser',productName:'Prism',copyright:'Prism contributors · GPL-3.0',
  directories:{output:'dist/windows',buildResources:'scripts/windows'},
  asar:false,npmRebuild:false,
  files:['package.json','src/**/*','!src/native/**','assets/**/*','!assets/Prism.iconset/**','!assets/Prism.icon/**','!assets/*.icns','!assets/blocker/lists/**','!assets/blocker/*.txt','LICENSE','THIRD-PARTY-NOTICES.md','CHANGELOG.md','!**/*.map','!**/*.d.ts'],
  extraResources:[{from:path.join(electronDist,'LICENSE'),to:'ELECTRON-LICENSE'},{from:path.join(electronDist,'LICENSES.chromium.html'),to:'LICENSES.chromium.html'}],
  win:{target:[{target:'nsis',arch:['x64']}],icon:'assets/Prism.ico',artifactName:'Prism-${version}-Windows-x64-Setup.${ext}',executableName:'Prism'},
  nsis:{oneClick:false,perMachine:false,allowToChangeInstallationDirectory:true,createDesktopShortcut:true,createStartMenuShortcut:true,shortcutName:'Prism',installerIcon:'assets/Prism.ico',uninstallerIcon:'assets/Prism.ico',include:'scripts/windows/installer.nsh',deleteAppDataOnUninstall:false,license:'LICENSE'}
 }});
 console.log(result.join('\n'));
})().catch(error=>{console.error(error);process.exit(1);});

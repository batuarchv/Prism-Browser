// 0.44 diagnostic (smoke profile): Prism must stay a regular Dock app with its window on screen while popovers
// (child panel windows), Beam and Lens open and close, and when Prism is in the background.
const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,makeTab,selectTab,toolWindows,commandBar,action})=>{
 const {BrowserWindow}=require('electron');const rows=[];
 const look=label=>{const r={label,dock:app.dock?.isVisible?.(),minimized:win.isMinimized(),visible:win.isVisible(),focused:win.isFocused(),windows:BrowserWindow.getAllWindows().map(w=>({id:w.id,title:w.getTitle(),visible:w.isVisible(),minimized:w.isMinimized(),parent:w.getParentWindow()?.id||null}))};rows.push(r);console.log('dock',JSON.stringify(r));};
 try{await win.webContents.executeJavaScript('finishSetup()').catch(()=>{});const t=makeTab('data:text/html,<title>Dock</title><p>page');selectTab(t.id);await delay(1500);look('start');
  for(const section of ['quick-site','quick-spaces','quick-extensions','appearance']){await toolWindows.open(section,{x:600,y:40,left:560});await delay(1200);look('open '+section);toolWindows.closeAll('test');await delay(800);look('closed '+section);}
  await commandBar().open();await delay(1200);look('beam open');commandBar().hide();await delay(800);look('beam closed');
  await toolWindows.open('quick-site',{x:600,y:40,left:560});await delay(800);win.blur();await delay(1500);look('popover then blur');toolWindows.closeAll('test');await delay(25000);look('after keep-warm destroy');
  console.log('dock flow done');
 }finally{app.exit(0);}
};

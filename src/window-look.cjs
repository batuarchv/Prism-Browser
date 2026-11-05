// Windows and Linux (Windows build, 0.50): borderless surfaces (Beam, Lens, Picture in Picture, the save-password panel) are
// transparent on the Mac so Liquid Glass shows through. Elsewhere there is no glass, and a transparent window would
// show the desktop and could not be resized on Windows, so they get a solid window in the theme's colour instead.
function windowLook({dark,video=false}={}){
 if(process.platform==='darwin')return {transparent:true,backgroundColor:'#00000000'};
 let night=dark;if(night===undefined)try{night=!!require('electron').nativeTheme?.shouldUseDarkColors;}catch{night=false;}
 return {backgroundColor:video?'#000000':night?'#1f1f1f':'#f6f6f7'};}
module.exports={windowLook};

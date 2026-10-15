const prismPresets=[
 {name:'Glacier',note:'Cool blue · clear and quiet',light:['#f3f7fb','#e4edf6','#ffffff','#223144','#586d84','#cad8e6','#386f9d'],dark:['#141d29','#1b2939','#243548','#edf5ff','#afc5df','#3c536e','#89bcec']},
 {name:'Matcha',note:'Soft green · a little calmer',light:['#f5f7f0','#e6eddd','#fcfdf8','#293629','#65705b','#cdd7bf','#507342'],dark:['#192019','#242f22','#2d3b2b','#eff5e8','#becdb1','#495d42','#a9ce8e']},
 {name:'Dusk',note:'Lavender · after hours',light:['#f7f4fb','#ece5f4','#ffffff','#352c45','#71647f','#d9cce5','#805ba4'],dark:['#211c2a','#2c2438','#382e47','#f6efff','#ccbbdf','#5b486e','#caa2ec']},
 {name:'Clay',note:'Warm earth · easy on the eyes',light:['#faf5ef','#efe3d6','#fffcf8','#403126','#796556','#dfcdbd','#9a5b38'],dark:['#251e1a','#322822','#41332b','#fbf1e7','#d5bdaa','#685040','#e9ab7d']},
 {name:'Rose',note:'Muted pink · a warmer day',light:['#fcf4f6','#f1e2e8','#fffafb','#442f38','#816570','#e2cbd4','#a25073'],dark:['#281c23','#37262f','#45303c','#fceff5','#d7b8c9','#704d60','#eea1c6']},
 {name:'Graphite',note:'Neutral · room to focus',light:['#f5f5f5','#e7e7e8','#ffffff','#27282b','#67686e','#d1d2d5','#5e6570'],dark:['#18191b','#222326','#2d2e32','#f4f4f6','#bfc0c7','#4b4d54','#b6bfce']}
];
const prismColorKeys=['canvas','sidebar','surface','text','textSecondary','border','accent'];
function presetTheme(preset){return {version:1,light:Object.fromEntries(prismColorKeys.map((k,i)=>[k,preset.light[i]])),dark:Object.fromEntries(prismColorKeys.map((k,i)=>[k,preset.dark[i]])),radius:12,rowHeight:36};}
if(typeof module!=='undefined')module.exports={prismPresets,presetTheme};

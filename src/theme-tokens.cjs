const defaults={version:1,light:{canvas:'#f4f5f7',sidebar:'#e9ecf0',surface:'#ffffff',text:'#20252c',textSecondary:'#5b6573',border:'#ccd2dc',accent:'#507fad'},dark:{canvas:'#17191e',sidebar:'#20242b',surface:'#292e37',text:'#f3f5f8',textSecondary:'#b8c0cd',border:'#46505f',accent:'#8bb6e0'},radius:12,rowHeight:36};
function validateTheme(value){
 if(!value||value.version!==1)throw Error('Choose Prism theme JSON version 1.');
 const output={version:1};for(const mode of ['light','dark']){output[mode]={};for(const key of Object.keys(defaults[mode])){const color=value[mode]?.[key];if(typeof color!=='string'||!/^#[0-9a-f]{6}$/i.test(color))throw Error('Theme colors must be six-digit hex values: '+mode+'.'+key);output[mode][key]=color;}}
 for(const [key,min,max] of [['radius',0,26],['rowHeight',28,56]]){if(!Number.isFinite(value[key])||value[key]<min||value[key]>max)throw Error('Invalid theme '+key);output[key]=value[key];}return output;
}
module.exports={defaults,validateTheme};

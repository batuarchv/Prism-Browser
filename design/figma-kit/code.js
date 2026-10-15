// Local development plugin. Creates editable scaffolding; no network access.
const initial={version:1,light:{canvas:'#f4f5f7',sidebar:'#e9ecf0',surface:'#ffffff',text:'#20252c',textSecondary:'#5b6573',border:'#ccd2dc',accent:'#507fad'},dark:{canvas:'#17191e',sidebar:'#20242b',surface:'#292e37',text:'#f3f5f8',textSecondary:'#b8c0cd',border:'#46505f',accent:'#8bb6e0'},radius:12,rowHeight:36};
const rgb=hex=>({r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255});
const hex=color=>'#'+['r','g','b'].map(k=>Math.round(color[k]*255).toString(16).padStart(2,'0')).join('');
figma.showUI(__html__,{width:400,height:390});
async function collection(){return (await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name==='Prism theme');}
async function createKit(){
 if(await collection())throw Error('Prism theme already exists. Edit its variables or export your theme.');
 await figma.loadFontAsync({family:'Inter',style:'Regular'});
 const c=figma.variables.createVariableCollection('Prism theme'),variables={};
 // One mode keeps this usable on free plans. Light and dark values have distinct names.
 for(const mode of ['light','dark'])for(const [key,value]of Object.entries(initial[mode])){const v=figma.variables.createVariable(mode+'/'+key,c,'COLOR');v.setValueForMode(c.defaultModeId,rgb(value));variables[mode+'/'+key]=v;}
 for(const key of ['radius','rowHeight']){const v=figma.variables.createVariable(key,c,'FLOAT');v.setValueForMode(c.defaultModeId,initial[key]);variables[key]=v;}
 const page=figma.createPage();page.name='Prism · Your design';await figma.setCurrentPageAsync(page);
 function fill(node,mode,key){node.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(initial[mode][key])},'color',variables[mode+'/'+key])];}
 function box(parent,name,x,y,w,h,mode,key='surface'){const n=figma.createFrame();parent.appendChild(n);n.name=name;n.x=x;n.y=y;n.resize(w,h);fill(n,mode,key);n.cornerRadius=12;return n;}
 function label(parent,text,x,y,mode,size=14){const n=figma.createText();parent.appendChild(n);n.fontName={family:'Inter',style:'Regular'};n.characters=text;n.fontSize=size;n.x=x;n.y=y;fill(n,mode,'text');return n;}
 for(const [i,mode]of ['light','dark'].entries()){
  const board=box(page,'Browser / '+mode,i*1340,0,1240,820,mode,'canvas');
  const side=box(board,'Sidebar · resize and redesign',0,0,260,820,mode,'sidebar');label(side,'●  ●  ●',20,20,mode);label(side,'Personal  ▾',20,66,mode,16);label(side,'+  New tab',20,106,mode);
  for(let n=0;n<4;n++){const f=box(side,'Favorite '+(n+1),20+n*54,150,44,44,mode);label(f,String(n+1),17,13,mode);}
  for(let n=0;n<5;n++){const row=figma.createComponent();side.appendChild(row);row.name='Tab / '+(n===0?'Selected':'Default '+n);row.x=12;row.y=220+n*44;row.resize(236,36);row.cornerRadius=8;fill(row,mode,n===0?'surface':'sidebar');label(row,n===0?'Website title':'Your tab title',12,10,mode);}
  label(side,'Downloads       Settings',20,775,mode);
  const toolbar=box(board,'Toolbar',274,12,952,52,mode);label(toolbar,'←   →   ↻          Search or enter address',18,17,mode);
  label(board,'Design your browser here',322,180,mode,28);label(board,'Keep component names. Replace this scaffold with your own layout.',322,226,mode);
  for(const [n,name]of ['Favorite card','Password account','Download row','Extension row'].entries()){const component=figma.createComponent();board.appendChild(component);component.name=name+' / '+mode;component.x=320;component.y=300+n*88;component.resize(520,68);component.cornerRadius=12;fill(component,mode,'surface');label(component,name,20,24,mode);}
 }
 const privateBoard=box(page,'Private / network states',0,920,1240,600,'dark','canvas');
 label(privateBoard,'Private network · design every state',32,32,'dark',24);
 for(const [i,state]of ['Direct','Starting Zapret','Zapret active','Stopped & blocked','Connection error'].entries()){const card=box(privateBoard,state,32+(i%3)*390,100+Math.floor(i/3)*200,360,170,'dark');label(card,state,20,24,'dark',18);label(card,'Profile selector · Start · Stop · Direct',20,74,'dark',13);}
 figma.viewport.scrollAndZoomIntoView(page.children);figma.notify('Editable Prism kit created.');
}
async function exportTheme(){
 const c=await collection();if(!c)throw Error('Create the kit first.');const out={version:1,light:{},dark:{}};
 for(const v of await figma.variables.getLocalVariablesAsync()){if(v.variableCollectionId!==c.id)continue;const value=v.valuesByMode[c.defaultModeId];if(v.resolvedType==='COLOR'){const [mode,key]=v.name.split('/');if(out[mode])out[mode][key]=hex(value);}else if(['radius','rowHeight'].includes(v.name))out[v.name]=value;}
 figma.ui.postMessage({theme:JSON.stringify(out,null,2)});
}
figma.ui.onmessage=async message=>{try{if(message.type==='create')await createKit();if(message.type==='export')await exportTheme();}catch(error){figma.ui.postMessage({error:error.message});}};

const folderNames=library=>[...new Set([...library.folders,...library.bookmarks.map(b=>b.folder).filter(Boolean)])];
const within=(name,parent)=>name===parent||name.startsWith(parent+' / ');
function renameFolder(library,from,to){
 if(typeof from!=='string'||typeof to!=='string')throw Error('Choose a folder and a new name.');
 to=to.trim();const names=folderNames(library);
 if(!names.includes(from))throw Error('This folder no longer exists.');
 if(!to||to.length>200||/[\x00-\x1f\x7f]/.test(to))throw Error('Use a folder name of 1–200 characters.');
 if(from===to)return;
 if(within(to,from))throw Error('A folder cannot be moved inside itself.');
 const affected=names.filter(n=>within(n,from)),others=new Set(names.filter(n=>!within(n,from)));
 const rename=n=>to+n.slice(from.length);
 if(affected.some(n=>others.has(rename(n))||rename(n).length>200))throw Error('A folder with this name already exists, or the name is too long.');
 library.folders=names.map(n=>within(n,from)?rename(n):n);
 for(const b of library.bookmarks)if(b.folder&&within(b.folder,from))b.folder=rename(b.folder);
 if(library.folderIcons)for(const n of affected)if(library.folderIcons[n]){library.folderIcons[rename(n)]=library.folderIcons[n];delete library.folderIcons[n];}
}
function removeFolder(library,name){
 if(typeof name!=='string'||!folderNames(library).includes(name))throw Error('This folder no longer exists.');
 // Remove only this folder. Descendant folders and all saved pages survive.
 library.folders=library.folders.filter(n=>n!==name);
 for(const b of library.bookmarks)if(b.folder===name)b.folder='';
 if(library.folderIcons)delete library.folderIcons[name];
}
// A folder's symbol (0.39): one of the folder symbols from the spaces' set; 'folder' goes back to the plain folder.
const FOLDER_SYMBOLS=['folder','briefcase','house','person','star','heart','bolt','book','pencil','code','terminal','flask','palette','camera','film','music','headphones','game','cart','gift','coffee','fork','dumbbell','paw','plane','car','map','globe','mountain','rocket','graduation','money','chat','leaf'];
function setFolderIcon(library,name,icon){if(!folderNames(library).includes(name))throw Error('This folder no longer exists.');if(!FOLDER_SYMBOLS.includes(icon))throw Error('Choose one of the folder symbols.');
 library.folderIcons={...normalizeFolderIcons(library.folderIcons)};if(icon==='folder')delete library.folderIcons[name];else library.folderIcons[name]=icon;}
function normalizeFolderIcons(value){const out={};if(value&&typeof value==='object')for(const [k,v] of Object.entries(value).slice(0,500))if(typeof k==='string'&&k.length<=200&&FOLDER_SYMBOLS.includes(v)&&v!=='folder')out[k]=v;return out;}
module.exports={folderNames,renameFolder,removeFolder,setFolderIcon,normalizeFolderIcons,FOLDER_SYMBOLS};

// Release notes in the app (0.49.1): prism-notes://release is built from CHANGELOG.md inside the app bundle, so every
// release must add its section there. release-local.cjs runs this before packaging: when CHANGELOG.md has no
// "## <version>" section yet, one is made from RELEASE-<version>.md (title from its "# Prism x · Title" line, its
// "## New / Improved / Fixed / Install notes" become "###" sections) and placed above the newest entry.
const fs=require('node:fs'),path=require('node:path');
function sectionFrom(version,release){const lines=String(release).replace(/<!--[\s\S]*?-->/g,'').split('\n');
 const title=(lines.find(l=>/^#\s/.test(l))||'').replace(/^#\s+Prism\s+[\d.]+\s*(?:[·—-]\s*)?/,'').trim();
 const body=[];let keep=false;for(const line of lines){const sub=line.match(/^##\s+(.+)$/);if(sub){keep=true;body.push('### '+sub[1].trim());continue;}if(keep)body.push(line);}
 const text=body.join('\n').replace(/\n{3,}/g,'\n\n').trim();if(!/^- /m.test(text))return null;
 return `## ${version}${title?' — '+title:''}\n\n${text}\n`;}
function ensure(root,version){const file=path.join(root,'CHANGELOG.md'),changelog=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'# Changelog\n';
 if(new RegExp('^##\\s+'+version.replace(/\./g,'\\.')+'(\\s|$)','m').test(changelog))return 'present';
 const notes=path.join(root,`RELEASE-${version}.md`);if(!fs.existsSync(notes))throw Error(`CHANGELOG.md has no ${version} section and RELEASE-${version}.md is missing.`);
 const section=sectionFrom(version,fs.readFileSync(notes,'utf8'));if(!section)throw Error(`RELEASE-${version}.md has no items for the release notes.`);
 const at=changelog.search(/^##\s/m);fs.writeFileSync(file,at<0?changelog.trimEnd()+'\n\n'+section:changelog.slice(0,at)+section+'\n'+changelog.slice(at));return 'added';}
if(require.main===module){const root=path.resolve(__dirname,'..');console.log('CHANGELOG.md '+require('../package.json').version+': '+ensure(root,require('../package.json').version));}
module.exports={ensure,sectionFrom};

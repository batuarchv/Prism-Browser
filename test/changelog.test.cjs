const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {ensure,sectionFrom}=require('../scripts/changelog.cjs'),{parse}=require('../src/release-notes.cjs');
test('each release adds its section to CHANGELOG.md for prism-notes://release (0.49.1)',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'prism-changelog-'));
 fs.writeFileSync(path.join(dir,'CHANGELOG.md'),'# Changelog\n\nIntro.\n\n## 1.0.0 — Old\n\n### New\n- Old thing.\n');
 fs.writeFileSync(path.join(dir,'RELEASE-1.1.0.md'),'# Prism 1.1.0 · Shiny\n<!-- date -->\n\n**Download:** x.dmg\n\n## New\n- **Thing.** Does it.\n\n## Install notes\nAd-hoc.\n\n<!-- dev notes: secret -->\n');
 assert.equal(ensure(dir,'1.1.0'),'added');assert.equal(ensure(dir,'1.1.0'),'present');
 const text=fs.readFileSync(path.join(dir,'CHANGELOG.md'),'utf8');assert.ok(!text.includes('secret')&&!text.includes('Download'));
 const r=parse(text);assert.deepEqual(r.map(x=>x.version),['1.1.0','1.0.0']);assert.equal(r[0].title,'Shiny');assert.deepEqual(r[0].sections.map(s=>s.name),['New','Install notes']);
 assert.throws(()=>ensure(dir,'2.0.0'),/RELEASE-2.0.0.md is missing/);assert.equal(sectionFrom('3.0.0','# Prism 3.0.0\n\n## New\nnothing'),null);});
test('the changelog has this version',()=>{const v=require('../package.json').version;assert.match(fs.readFileSync(path.join(__dirname,'../CHANGELOG.md'),'utf8'),new RegExp('^## '+v.replace(/\./g,'\\.')+' ','m'));});

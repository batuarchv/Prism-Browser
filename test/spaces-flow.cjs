// Spaces end to end (PRISM_TEST_FLOW=spaces-flow.cjs): the popover lists, filters, switches, reorders, customizes,
// creates and deletes spaces, the Spaces menu follows them, and the 40-space limit holds.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,win,action,snapshot,toolWindows,tabs})=>{
 const checks=[],check=name=>{checks.push(name);console.log('ok -',name);};
 const until=async(f,what)=>{for(let i=0;i<80;i++){try{if(await f())return;}catch{}await delay(100);}throw Error('Timed out: '+what);};
 const js=async code=>{const body=/^(const |let )|;/.test(code)?code:'return ('+code+')';const r=await toolWindows.get().webContents.executeJavaScript(`(()=>{try{return {v:(()=>{${body}})()};}catch(e){return {e:String(e.stack||e)};}})()`);if(r.e)throw Error(code+' → '+r.e);return r.v;};
 const key=(k,extra='')=>js(`(()=>{const t=document.activeElement&&document.querySelector('[data-pane=spaces]').contains(document.activeElement)?document.activeElement:document.querySelector('[data-pane=spaces]');t.dispatchEvent(new KeyboardEvent('keydown',{key:${JSON.stringify(k)},bubbles:true,cancelable:true${extra}}));})()`);
 const ids=()=>snapshot().settings.spaces.map(s=>s.id);
 async function open(){await win.webContents.executeJavaScript("document.getElementById('space-button').click()");await until(()=>toolWindows.visible()&&js("!document.querySelector('[data-pane=spaces]').hidden&&!!document.querySelector('.space-list .space-row')"),'popover');await delay(150);}
 async function closed(){await until(()=>!toolWindows.visible(),'popover closed');}
 const menuItems=()=>require('electron').Menu.getApplicationMenu().items.find(i=>i.label==='Spaces').submenu.items;
 try{
  await delay(800);
  // Starting point: Personal and Work.
  assert.deepEqual(ids(),['personal','work']);
  await open();
  assert.equal(await js("document.querySelectorAll('.space-list .space-row').length"),2);
  assert.equal(await js("document.querySelector('.space-search-box').hidden"),true);
  assert.equal(await js("document.querySelector('.space-row.current').dataset.id"),'personal');
  assert.equal(await js("!!document.querySelector('.space-count')"),false,'no space counter');
  check('list shows the spaces, and the current one');
  // 2 switches to Work and closes the popover.
  await key('2');await closed();assert.equal(snapshot().space,'work');check('number key switches space');
  // New space from the editor, with a name, icon and custom colour.
  await open();await js("document.querySelector('.space-new').click()");await until(()=>js("!!document.getElementById('space-name')"),'editor');
  assert.match(await js("document.querySelector('.space-done').textContent"),/Create/);
  assert.equal(await js("!!document.querySelector('.space-delete')"),false);
  await js("const n=document.getElementById('space-name');n.value='Design';n.dispatchEvent(new Event('input'))");
  await js("document.querySelector('.space-icon[data-icon=palette]').click()");
  await js("const h=document.getElementById('space-hex');h.focus();h.value='3a8';h.dispatchEvent(new Event('change'))");
  assert.equal(snapshot().settings.spaces.length,2,'nothing is created before Create space');
  await js("document.querySelector('.space-done').click()");await closed();
  const design=snapshot().settings.spaces[2];assert.deepEqual({name:design.name,icon:design.icon,color:design.color},{name:'Design',icon:'palette',color:'#33aa88'});
  assert.equal(snapshot().space,design.id);assert(tabs.some(t=>t.space===design.id),'the new space opens with a tab');
  await until(async()=>await win.webContents.executeJavaScript("getComputedStyle(document.documentElement).getPropertyValue('--space-accent').trim()")==='#33aa88','window tinted');
  check('create a space with name, icon and hex colour; it becomes current and tints the window');
  // Customize: rename (saved after typing stops), preset colour, icon; Esc goes back to the list.
  await open();await js("document.querySelector('.space-row[data-id=work] .space-edit').click()");await until(()=>js("!!document.getElementById('space-name')"),'editor');
  await js("const n=document.getElementById('space-name');n.value='Office';n.dispatchEvent(new Event('input'))");
  await until(()=>snapshot().settings.spaces.find(s=>s.id==='work').name==='Office','rename saved');
  await js("document.querySelector('.space-swatch[data-value=\"preset:Matcha\"]').click()");await js("document.querySelector('.space-icon[data-icon=code]').click()");
  let work=snapshot().settings.spaces.find(s=>s.id==='work');assert.equal(work.color,'preset:Matcha');assert.equal(work.icon,'code');
  await key('Escape');await until(()=>js("!!document.querySelector('.space-list')"),'back to list');assert(toolWindows.visible(),'Esc in the editor only goes back');
  assert.match(await js("document.querySelector('.space-row[data-id=work] .space-label').textContent"),/Office/);
  check('customize renames, recolours and changes the icon live; Esc returns to the list');
  // Theme colour clears the custom one.
  await js("document.querySelector('.space-row[data-id=work] .space-edit').click()");await until(()=>js("!!document.getElementById('space-name')"),'editor');
  await js("document.querySelector('.space-swatch.theme').click()");assert.equal(snapshot().settings.spaces.find(s=>s.id==='work').color,'');
  await js("document.querySelector('.space-back').click()");check('theme colour resets a space');
  // Reorder with ⌥↓ on a focused row; the Spaces menu follows with ⌃1…
  await until(()=>js("!!document.querySelector('.space-row[data-id=personal] .space-pick')"),'list');
  await js("document.querySelector('.space-row[data-id=personal] .space-pick').focus()");await key('ArrowDown',',altKey:true');
  await until(()=>ids()[1]==='personal','moved');assert.deepEqual(ids(),['work','personal',design.id]);
  assert.equal(await js("document.activeElement.closest('.space-row')?.dataset.id"),'personal','focus stays on the moved space');
  const items=menuItems().filter(i=>i.accelerator);assert.deepEqual(items.map(i=>[i.label,i.accelerator]),[['Office','Control+1'],['Personal','Control+2'],['Design','Control+3']]);
  check('⌥↓ reorders, focus follows, Spaces menu gets ⌃1…⌃3');
  // Arrow keys move between rows.
  await key('ArrowUp');assert.equal(await js("document.activeElement.closest('.space-row')?.dataset.id"),'work');check('arrow keys move between spaces');
  // Up to 40: search appears after 6, New space turns off at 40, the 41st is refused.
  for(let i=snapshot().settings.spaces.length;i<40;i++)await action('space-add',{name:'Extra '+i});
  await action('space','work');assert.equal(snapshot().settings.spaces.length,40);await assert.rejects(()=>action('space-add',{}),/up to 40/);
  await open();assert.equal(await js("document.querySelector('.space-new').disabled"),true);assert.equal(await js("document.querySelector('.space-search-box').hidden"),false);
  const h=toolWindows.get().getBounds().height;assert(h<=640,'popover height '+h);assert(await js("document.querySelector('.space-list').scrollHeight>document.querySelector('.space-list').clientHeight"),'long lists scroll');
  check('40-space limit, search shown, list scrolls inside a bounded popover');
  // Search filters; Enter opens the first match.
  await js("const s=document.getElementById('space-search');s.focus();s.value='desi';s.dispatchEvent(new Event('input'))");
  assert.equal(await js("[...document.querySelectorAll('.space-list .space-row')].filter(r=>!r.hidden).length"),1);
  await js("const s=document.getElementById('space-search');s.value='zzz';s.dispatchEvent(new Event('input'))");assert.equal(await js("document.querySelector('.space-empty').hidden"),false);
  await js("const s=document.getElementById('space-search');s.value='desi';s.dispatchEvent(new Event('input'))");
  await key('Enter');await closed();assert.equal(snapshot().space,design.id);check('search filters and Enter opens the match');
  // Delete the current space from the editor: asks in place, closes its tabs, moves to the first space.
  const designTabs=snapshot().spaceTabs[design.id]||0;assert(designTabs>0);
  await open();await js(`document.querySelector('.space-row[data-id="${design.id}"] .space-edit').click()`);await until(()=>js("!!document.querySelector('.space-delete')"),'editor');
  await js("document.querySelector('.space-delete').click()");assert.match(await js("document.querySelector('.space-confirm-text').textContent"),/tab/);
  await key('Escape');assert.equal(await js("!!document.querySelector('.space-delete')"),true,'Esc cancels the question');assert(snapshot().settings.spaces.some(s=>s.id===design.id));
  await js("document.querySelector('.space-delete').click()");await js("document.querySelector('.space-confirm-delete').click()");
  await until(()=>!snapshot().settings.spaces.some(s=>s.id===design.id),'deleted');
  assert.equal(snapshot().space,'work');assert.equal(snapshot().spaceTabs[design.id],undefined);
  await until(()=>js("!!document.querySelector('.space-list')"),'list after delete');assert.equal(await js(`!!document.querySelector('.space-row[data-id="${design.id}"]')`),false);
  check('delete asks in place, closes the space’s tabs and moves to the first space');
  // Delete the first space: the next one becomes home; tabs that never had a space id are included.
  await js("closePanel();");await closed();
  for(const id of ids().slice(2))await action('space-remove',{id,confirmed:true});
  assert.deepEqual(ids(),['work','personal']);await action('space','personal');tabs.find(t=>t.space==='personal').space=undefined;
  await action('space-remove',{id:'personal',confirmed:true});assert.deepEqual(ids(),['work']);assert.equal(snapshot().space,'work');assert.equal(snapshot().spaceTabs.personal,undefined);
  assert.deepEqual(await action('space-remove',{id:'work',confirmed:true}),{error:'Keep at least one space.'});
  await open();assert.equal(await js("document.querySelectorAll('.space-list .space-row').length"),1);
  await js("document.querySelector('.space-row[data-id=work] .space-edit').click()");await until(()=>js("!!document.getElementById('space-name')"),'editor');assert.equal(await js("!!document.querySelector('.space-delete')"),false);
  check('deleting the first space falls back to the next; the last one cannot be deleted');
  // Private is listed and opens.
  await js("document.querySelector('.space-back').click()");await until(()=>js("!!document.querySelector('.space-private .space-pick')"),'list');await js("document.querySelector('.space-private .space-pick').click()");await closed();assert.equal(snapshot().space,'private');
  check('Private opens from the list');
  const report={passed:true,checks,electron:process.versions.electron};fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../reports/spaces-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  app.exit(0);
 }catch(error){console.error('FAILED',error.stack);app.exit(1);}
};

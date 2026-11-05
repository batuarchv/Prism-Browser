const test=require('node:test'),assert=require('node:assert/strict');const {createSpectrum,normalize,dayKey}=require('../src/spectrum.cjs');
const clock=start=>{let t=start;return {now:()=>t,go:ms=>{t+=ms;}};};
test('segments follow the page in front, merge, skip blips and stop while away',()=>{
 const c=clock(new Date(2026,9,24,9).getTime()),s=createSpectrum({now:c.now});
 s.presence('https://github.com/a','personal');c.go(10*60000);s.presence('https://www.github.com/b','personal');c.go(5*60000);
 s.presence('https://figma.com/','personal');c.go(5000);s.presence('https://github.com/','personal');c.go(60000);
 s.focus(false,'','personal');c.go(30*60000);s.focus(true,'https://news.ycombinator.com/','personal');c.go(2*60000);
 s.presence('https://secret.test/','private');c.go(60000);
 const v=s.view();assert.deepEqual(v.segments.map(x=>x.host),['github.com','news.ycombinator.com']);assert.equal(v.segments[0].to-v.segments[0].from,16*60000+5000);});
test('moments keep the open tabs once per change, never Private, and restore by time',()=>{
 const c=clock(new Date(2026,9,24,9).getTime()),s=createSpectrum({now:c.now});
 const tab=(url,space='personal')=>({url,title:url,space});
 s.moment([tab('https://a.test/'),tab('https://p.test/','private')]);c.go(10000);s.moment([tab('https://a.test/'),tab('https://b.test/')]);
 c.go(5*60000);s.moment([tab('https://a.test/'),tab('https://b.test/')]);c.go(5*60000);s.moment([tab('https://c.test/','work')]);
 assert.equal(s.view().moments.length,2);const first=s.view().moments[0].at;
 assert.deepEqual(s.at(first+60000,'personal').tabs.map(t=>t.url),['https://a.test/','https://b.test/']);assert.deepEqual(s.at(c.now(),'personal').tabs,[]);});
test('only today is loaded',()=>{const now=new Date(2026,9,24,12).getTime();assert.deepEqual(normalize({day:'2026-10-23',segments:[{from:1,to:2,host:'x'}]},now).segments,[]);
 assert.equal(normalize({day:dayKey(now),segments:[{from:1,to:2,host:'x'},{from:3,to:1,host:'y'}],moments:[{at:1,tabs:[{url:'https://x/',space:'private'}]}]},now).segments.length,1);});
test('chapters split at pauses, are named by kind, and habits suggest sites usually opened now',()=>{
 const c=clock(new Date(2026,9,21,9).getTime());let saved=null;const s=createSpectrum({now:c.now,save:d=>{saved=d;}});
 s.presence('https://github.com/a','personal','Pull request');c.go(30*60000);s.presence('https://stackoverflow.com/q','personal');c.go(10*60000);s.focus(false,'','personal');c.go(40*60000);
 s.focus(true,'https://www.youtube.com/watch','personal');c.go(20*60000);
 const v=s.view();assert.equal(v.chapters.length,2);assert.equal(v.chapters[0].kind,'code');assert.equal(v.chapters[1].kind,'video');assert.deepEqual(s.chapters()[0].titles,['Pull request']);
 s.setInsights(v.insightsKey,{titles:['Reviewing code','Watching videos'],summary:'A focused morning.'});assert.equal(s.view().chapters[0].title,'Reviewing code');assert.equal(s.view().summary,'A focused morning.');
 s.flush();const next=createSpectrum({now:()=>new Date(2026,9,22,9,15).getTime(),load:()=>saved});const usual=next.usual({openHosts:['stackoverflow.com']}).map(u=>u.host);assert.equal(usual[0],'github.com');assert.ok(!usual.includes('stackoverflow.com'));assert.equal(next.view().segments.length,0);});
test('Spectrum follows the space and All usage shows every space (0.39.1)',()=>{let t=new Date(2026,9,26,10).getTime();const s=require('../src/spectrum.cjs').createSpectrum({now:()=>t});
 s.presence('https://github.com/','personal');t+=60000;s.presence('https://slack.com/','work');t+=120000;s.presence('https://github.com/','work');t+=60000;s.presence('','personal');
 const personal=s.view({space:'personal'}),work=s.view({space:'work'}),all=s.view({});
 assert.deepEqual(personal.segments.map(x=>x.host),['github.com']);assert.deepEqual(work.segments.map(x=>x.host),['slack.com','github.com']);assert.equal(all.segments.length,3);
 assert.equal(work.space,'work');assert.notEqual(personal.insightsKey,all.insightsKey);
 s.setInsights(work.insightsKey,{titles:['Team chat'],summary:'Work day'},'work');assert.equal(s.view({space:'work'}).chapters[0].title,'Team chat');assert.equal(s.view({space:'personal'}).summary,'');});
test('0.49: the day at a glance, a record per finished day and notes against your usual day',()=>{const S=require('../src/spectrum.cjs');
 const st=S.statsOf([{from:new Date(2026,10,2,9).getTime(),to:new Date(2026,10,2,9,40).getTime(),host:'github.com'},{from:new Date(2026,10,2,9,41).getTime(),to:new Date(2026,10,2,10,10).getTime(),host:'stackoverflow.com'},{from:new Date(2026,10,2,10,11).getTime(),to:new Date(2026,10,2,10,20).getTime(),host:'youtube.com'}],new Date(2026,10,2,10,30).getTime());
 assert.equal(Math.round(st.active/60000),78);assert.equal(st.hours[9],59);assert.equal(st.hours[10],19);assert.equal(st.kinds[0].kind,'code');assert.equal(st.switches,2);assert.equal(st.recentSwitches,2);
 assert.equal(st.focus.kind,'code');assert.equal(Math.round(st.focus.ms/60000),69);assert.equal(st.focus.host,'github.com');
 // Three earlier weekdays of about an hour each by 10:30, then a much longer morning.
 let t=new Date(2026,10,2,8).getTime();let saved=null;const s=S.createSpectrum({now:()=>t,save:d=>{saved=d;}});
 for(let day=0;day<3;day++){t=new Date(2026,10,2+day,9).getTime();s.focus(true,'https://github.com/','personal');t+=60*60000;s.presence('https://x.com/','personal');t+=10*60000;s.focus(false,'','personal');}
 t=new Date(2026,10,5,8).getTime();s.focus(true,'https://github.com/','personal');t+=2*60*60000;s.presence('https://youtube.com/','personal');t+=30*60000;
 const v=s.view({space:'personal'});assert.equal(v.glance.typical.days,3);assert.equal(Math.round(v.glance.typical.soFar/60000),65);
 assert.equal(v.notes[0].type,'pace');assert.equal(v.notes[0].tone,'up');assert.equal(v.notes[1].type,'focus');assert.ok(v.notes[1].record);assert.ok(v.notes.some(n=>n.type==="kind"&&n.kind==="video"));
 assert.equal(v.week.length,7);assert.equal(v.week.at(-1).active,150);assert.equal(v.week.at(-2).active,70);
 // Records keep minutes only, survive a restart and come from a day Prism was closed over.
 s.flush();const rec=saved.history.at(-1);assert.deepEqual(Object.keys(rec.by).sort(),['','personal']);assert.ok(!JSON.stringify(saved.history).includes('github'));
 const later=S.normalize(saved,new Date(2026,10,6,9).getTime());assert.equal(later.history.length,4);assert.equal(later.history.at(-1).by[''].active,150);
 assert.deepEqual(S.normalizeHistory([{day:'2026-11-1',by:{'':{active:5,hours:Array(24).fill(1),kinds:{code:5,evil:3}}}},{day:'bad',by:{}}]).map(h=>Object.keys(h.by[''].kinds)),[['code']]);
 // Only a day or two of history: no comparisons yet.
 const fresh=S.createSpectrum({now:()=>t});fresh.presence('https://github.com/','personal');t+=30*60000;assert.equal(fresh.view({}).glance.typical,null);assert.ok(!fresh.view({}).notes.some(n=>n.type==='pace'));});

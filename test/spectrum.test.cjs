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

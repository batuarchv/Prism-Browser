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

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
exports.run = async ({app, makeTab, selectTab, sleepTab, enforceAwakeBudget, tabs}) => {
  const server = http.createServer((_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><title>Prism benchmark</title><h1>Local benchmark</h1><input><script>window.fixture = new Uint8Array(8*1024*1024);fixture.fill(42);</script>');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const root = `http://127.0.0.1:${server.address().port}`;
  const samples = [];
  const sample = label => {
    const processes = app.getAppMetrics().map(({type, memory}) => ({type, ...memory}));
    samples.push({label, liveTabs: tabs.filter(t => t.view).length, rssMiB: processes.reduce((n,p) => n + p.workingSetSize, 0) / 1024, processes});
  };
  sample('empty-shell');
  for (let i=1;i<=20;i++) {
    const t = makeTab(`${root}/tab-${i}`);
    while (t.view.webContents.isLoading()) await wait(50);
    if ([1,5,10,20].includes(i)) { await wait(750); sample(`${i}-live-tabs`); }
  }
  const active = tabs.at(-1);
  for(const t of tabs)if(t!==active)t.lastUsed=Date.now()-61000;
  await enforceAwakeBudget();await wait(1500);sample('after-awake-budget');assert.equal(tabs.filter(t=>t.view).length,8);
  for (const t of tabs.filter(t => t.view && t !== active)) await sleepTab(t, true);
  await wait(1500); sample('after-sleep');
  assert.equal(tabs.filter(t => t.view).length, 1);
  const asleep = tabs.find(t => t.url && !t.view);
  const start = performance.now(); selectTab(asleep.id);
  while (asleep.view.webContents.isLoading()) await wait(25);
  const restoreMs = performance.now() - start;
  assert.equal(await asleep.view.webContents.executeJavaScript('fixture[0]'), 42);
  const report = {engine: 'Electron', versions: process.versions, fixture: 'Local HTTP, same origin, 8 MiB touched Uint8Array per tab. Not representative of real sites. Working set sums may double-count shared memory.', samples, restoreMs};
  fs.writeFileSync(process.env.PRISM_BENCHMARK_REPORT||path.resolve(__dirname, '../reports/electron-benchmark.json'), JSON.stringify(report, null, 2));
  server.close(); app.quit();
};

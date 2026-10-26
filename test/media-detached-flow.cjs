// 0.39.1 (PRISM_TEST_FLOW=media-detached-flow.cjs): music sites like SoundCloud play through an audio element that is
// never added to the page. The sidebar miniplayer must still find it once you leave the tab, and pause it.
const assert=require('node:assert/strict'),http=require('node:http');const wait=ms=>new Promise(r=>setTimeout(r,ms));
exports.run=async({app,makeTab,selectTab,snapshot,media})=>{
 const rate=8000,n=rate*20,wav=Buffer.alloc(44+n*2);wav.write('RIFF',0);wav.writeUInt32LE(36+n*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(n*2,40);
 for(let i=0;i<n;i++)wav.writeInt16LE(Math.round(Math.sin(i/rate*2*Math.PI*220)*800),44+i*2);
 const server=http.createServer((req,res)=>{if(req.url==='/tone.wav'){res.writeHead(200,{'Content-Type':'audio/wav','Content-Length':wav.length});res.end(wav);return;}res.writeHead(200,{'Content-Type':'text/html'});res.end('<title>Cloud tune</title><p>player</p><script>navigator.mediaSession.metadata=new MediaMetadata({title:"Night Drive",artist:"Prism Band"});</script>');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const music=makeTab(base+'/',true);await wait(2500);
 await music.view.webContents.executeJavaScript(`window.player=new Audio('/tone.wav');window.player.play()`,true);await wait(1500);
 assert.equal(await music.view.webContents.executeJavaScript('document.querySelectorAll("audio").length'),0,'the audio element is not in the page');
 makeTab(base+'/other',true);await wait(1500);
 const row=snapshot().media;assert.ok(row,'miniplayer shows the detached player');assert.equal(row.title,'Night Drive');assert.equal(row.playing,true);
 await media().control('toggle');await wait(600);assert.equal(await music.view.webContents.executeJavaScript('window.player.paused'),true,'miniplayer paused it');
 console.log(JSON.stringify({title:row.title,artist:row.artist,playing:row.playing}));server.close();
 if(process.env.PRISM_TEST_FLOW?.includes('media-detached'))app.exit(0);};

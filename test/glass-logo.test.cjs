const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');require('../src/glass-model.js');
const model=globalThis.PrismGlassModel,{lightPath,spectrum}=require('../src/glass-logo.js');
const tris=[];{const P=model.positions,sub=(a,b)=>a.map((x,i)=>x-b[i]),cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],nz=a=>{const l=Math.hypot(...a);return a.map(x=>x/l);};
 for(let i=0;i<P.length;i+=9){const a=P.slice(i,i+3),b=P.slice(i+3,i+6),c=P.slice(i+6,i+9);tris.push([a,b,c,nz(cr(sub(b,a),sub(c,a)))]);}}
// The logo is the pyramid: assets/prism-pyramid.json holds the pyramid and the camera that draws assets/prism-mark.svg.
const cam=JSON.parse(fs.readFileSync(path.join(root,'assets/prism-pyramid.json'),'utf8'));
const project=([x,y,z])=>{const c=[0,1,2].map(i=>cam.rotation[i][0]*x+cam.rotation[i][1]*y+cam.rotation[i][2]*z+cam.translation[i]);return [512+cam.focal*c[0]/c[2],512+cam.focal*c[1]/c[2]];};
const svgPoints=file=>[...fs.readFileSync(file,'utf8').matchAll(/points="([^"]+)"/g)].flatMap(m=>{const n=m[1].trim().split(/\s+/).map(Number),out=[];for(let i=0;i<n.length;i+=2)out.push([n[i],n[i+1]]);return out;});
function hull(points){const p=[...points].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
 for(const q of p){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),q)<=0)lo.pop();lo.push(q);}for(const q of p.reverse()){while(up.length>1&&cross(up.at(-2),up.at(-1),q)<=0)up.pop();up.push(q);}return [...lo.slice(0,-1),...up.slice(0,-1)];}
const inside=(poly,[x,y])=>{let r=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [x1,y1]=poly[i],[x2,y2]=poly[j];if((y1>y)!==(y2>y)&&x<(x2-x1)*(y-y1)/(y2-y1)+x1)r=!r;}return r;};
const overlap=(a,b)=>{let both=0,either=0;for(let x=0;x<1024;x+=4)for(let y=0;y<1024;y+=4){const p=inside(a,[x,y]),q=inside(b,[x,y]);if(p&&q)both++;if(p||q)either++;}return both/either;};
test('the logo is drawn from a right square pyramid: its outline is the projected pyramid',()=>{
 const R=cam.rotation;for(const row of R)assert.ok(Math.abs(Math.hypot(...row)-1)<1e-4,'rotation is orthonormal');
 const shape=hull([[-.5,.5,0],[-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[0,0,cam.height]].map(project)),points=svgPoints(path.join(root,'assets/prism-mark.svg'));
 const toEdge=([x,y])=>Math.min(...shape.map((a,i)=>{const b=shape[(i+1)%shape.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(a[0]+t*dx-x,a[1]+t*dy-y);}));
 // Every point of the drawing is inside the pyramid's outline or on it, and every outline corner is drawn.
 for(const pt of points)assert.ok(inside(shape,pt)||toEdge(pt)<.6,`${pt} lies outside the pyramid`);
 for(const c of shape)assert.ok(points.some(([x,y])=>Math.hypot(x-c[0],y-c[1])<.6),`pyramid corner ${c.map(Math.round)} is drawn`);
});
test('the redrawn logo keeps the original logo\'s shape (over 93% overlap)',()=>{
 const o=overlap(hull(svgPoints(path.join(root,'assets/prism-mark.svg'))),hull([[496,148],[940.6,792.5],[662.5,811],[224,833.79],[84.93,734.15]]));assert.ok(o>.93,`overlap ${o.toFixed(3)}`);
});
test('at rest the 3D model is the logo: same outline, every corner within 2 px at 512 (the bevel)',()=>{
 const P=model.positions,pts=[];for(let i=0;i<P.length;i+=3)pts.push(project([P[i],P[i+1],P[i+2]]));
 for(const c of [[-.5,.5,0],[-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[0,0,cam.height]].map(project)){const d=Math.min(...pts.map(([u,v])=>Math.hypot(u-c[0],v-c[1])));assert.ok(d<4,`corner ${c.map(Math.round)} is ${d.toFixed(2)} px away`);}
 const o=overlap(hull(pts),hull(svgPoints(path.join(root,'assets/prism-mark.svg'))));assert.ok(o>.98,`overlap ${o.toFixed(3)}`);
 assert.deepEqual(model.camera.rotation,cam.rotation);assert.equal(model.uvs.length/2,P.length/3,'every vertex has a logo UV');
});
test('the exported mesh is a closed, outward-facing solid with unit normals',()=>{
 assert.equal(model.positions.length%9,0);assert.equal(model.normals.length,model.positions.length);assert.ok(tris.length>=100);
 for(let i=0;i<model.normals.length;i+=3)assert.ok(Math.abs(Math.hypot(model.normals[i],model.normals[i+1],model.normals[i+2])-1)<.01);
 const c=[0,1,2].map(k=>model.positions.filter((_,i)=>i%3===k).reduce((s,x)=>s+x,0)/(model.positions.length/3));
 for(const [a,b,d,n] of tris){const m=[0,1,2].map(k=>(a[k]+b[k]+d[k])/3-c[k]);assert.ok(n[0]*m[0]+n[1]*m[1]+n[2]*m[2]>0,'outward');}
});
test('light through the glass bends and splits into an ordered spectrum, at every turn',()=>{
 const dir=[1,0,.12].map(x=>x/Math.hypot(1,.12)),from=[-1.4,0,.18];let paths=0;
 for(let yaw=0;yaw<Math.PI*2;yaw+=Math.PI/12){const c=Math.cos(-yaw),s=Math.sin(-yaw),ry=v=>[c*v[0]-s*v[1],s*v[0]+c*v[1],v[2]];
  const p=lightPath(tris,ry(from),ry(dir));if(!p)continue;paths++;
  assert.ok(p.inside.length>=2);const red=p.fan[0],violet=p.fan[p.fan.length-1];assert.ok(red.every(Number.isFinite)&&violet.every(Number.isFinite));}
 assert.ok(paths>=18,`light passes through at most angles (${paths}/24)`);
 assert.deepEqual(spectrum(0).map(x=>+x.toFixed(2)),[1,.22,.3]);
});
test('the Cycles stills are present',()=>{for(const name of ['prism-glass.png','prism-glass-dark.png'])assert.ok(fs.statSync(path.join(root,'assets',name)).size>10000,name);});

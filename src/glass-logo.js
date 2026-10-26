// The Prism logo as a live 3D glass object. The logo is a right square pyramid seen through a perspective camera
// (assets/prism-pyramid.json); the mesh is the Blender model of it (scripts/blender/prism-logo.py → glass-model.js),
// and small logos use its Cycles stills (glass-ui.js). Plain WebGL2, no library: a back-face pass gives each pixel the
// glass thickness and exit normal; the front pass refracts in and out per colour channel (dispersion) against the
// Blender studio, adds Fresnel reflection, and lays the logo's own face colours (assets/prism-mark-flat.png, projected
// from the logo's pose) over the glass, so at rest it is the logo. A white beam enters from the left and leaves as a
// spectrum, ray-traced through the mesh on the CPU every frame. Drag to spin, click to switch the light; after a drag
// it glides back to the logo's pose. It draws only while moving and visible; Reduce Motion removes the glide.
(function(root){
 const IOR=1.47,FAN=14,SPECTRUM=[[1,.22,.3],[1,.55,.2],[1,.88,.3],[.4,.88,.45],[.25,.7,1],[.42,.4,1],[.7,.38,.95]];
 // Spectrum colour at t (0 red … 1 violet), blended between the stops above.
 const spectrum=t=>{const x=Math.max(0,Math.min(1,t))*(SPECTRUM.length-1),i=Math.min(SPECTRUM.length-2,Math.floor(x)),f=x-i;return SPECTRUM[i].map((c,k)=>c+(SPECTRUM[i+1][k]-c)*f);};
 // Canvas size relative to the logo box: room on both sides for the light.
 const SX=3.2,SY=1.5;
 // The white light, in the pyramid's world (z up, base side 1): from the left, rising slightly through the lower body;
 // it bends at each face it crosses and leaves spread into colours.
 const BEAM_DIR=[1,0,.12].map(x=>x/Math.hypot(1,.12)),BEAM_FROM=[-1.4,0,.18];
 // The logo's face colours, next to this script (works from any page that loads it).
 const LOGO_URL=typeof document!=='undefined'&&document.currentScript?new URL('../assets/prism-mark-flat.png',document.currentScript.src).href:'';
 const reducedMotion=()=>document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const isDark=()=>document.documentElement.dataset.theme==='dark';

 // ---- small vector/matrix helpers (column-major 4×4) ----
 const v3={sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
  cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];}};
 // GLSL refract(): I incident, N facing against I, eta = n1/n2. Null on total internal reflection.
 function refract(I,N,eta){const c=v3.dot(N,I),k=1-eta*eta*(1-c*c);return k<0?null:v3.sub(v3.mul(I,eta),v3.mul(N,eta*c+Math.sqrt(k)));}
 const reflect=(I,N)=>v3.sub(I,v3.mul(N,2*v3.dot(N,I)));
 const rotZ=a=>{const c=Math.cos(a),s=Math.sin(a);return [[c,s,0],[-s,c,0],[0,0,1]];}; // columns
 const FLIP=[[1,0,0],[0,-1,0],[0,0,-1]],ZUP_TO_YUP=[[1,0,0],[0,0,-1],[0,1,0]]; // camera (y down, z forward) → GL; z-up world → y-up
 const m3v=(m,v)=>[m[0][0]*v[0]+m[1][0]*v[1]+m[2][0]*v[2],m[0][1]*v[0]+m[1][1]*v[1]+m[2][1]*v[2],m[0][2]*v[0]+m[1][2]*v[1]+m[2][2]*v[2]];
 const m3m=(a,b)=>b.map(col=>m3v(a,col));
 const m3T=m=>[[m[0][0],m[1][0],m[2][0]],[m[0][1],m[1][1],m[2][1]],[m[0][2],m[1][2],m[2][2]]];

 // Ray against the triangles (Möller–Trumbore); returns the nearest hit beyond tMin with the face normal.
 function cast(tris,o,d,tMin=1e-4){let best=null;for(const [a,b,c,n] of tris){const e1=v3.sub(b,a),e2=v3.sub(c,a),p=v3.cross(d,e2),det=v3.dot(e1,p);if(Math.abs(det)<1e-9)continue;
  const inv=1/det,s=v3.sub(o,a),u=v3.dot(s,p)*inv;if(u<0||u>1)continue;const q=v3.cross(s,e1),v=v3.dot(d,q)*inv;if(v<0||u+v>1)continue;const t=v3.dot(e2,q)*inv;
  if(t>tMin&&(!best||t<best.t))best={t,p:v3.add(o,v3.mul(d,t)),n};}return best;}
 // The light path through the turned glass: entry, bounces inside, exit, and one outgoing ray per spectrum colour.
 function lightPath(tris,origin,dir){const enter=cast(tris,origin,dir);if(!enter||v3.dot(dir,enter.n)>=0)return null;
  let d=refract(dir,enter.n,1/IOR),p=enter.p;const inside=[enter.p];
  for(let bounce=0;bounce<5&&d;bounce++){const hit=cast(tris,p,d,1e-3);if(!hit)return null;inside.push(hit.p);
   const out=refract(d,v3.mul(hit.n,-1),IOR);if(out){const fan=Array.from({length:FAN},(_,i)=>refract(d,v3.mul(hit.n,-1),1.44+i/(FAN-1)*.1)||out);return {enter:enter.p,inside,exit:hit.p,fan};}
   d=reflect(d,v3.mul(hit.n,-1));p=hit.p;}
  return null;}

 const VS=`#version 300 es
 in vec3 aPos;in vec3 aNormal;in vec2 aUV;uniform mat4 uModelView,uProj;uniform mat3 uNormal;out vec3 vPos;out vec3 vNormal;out vec2 vUV;
 void main(){vec4 p=uModelView*vec4(aPos,1.);vPos=p.xyz;vNormal=uNormal*aNormal;vUV=aUV;gl_Position=uProj*p;}`;
 const BACK=`#version 300 es
 precision highp float;in vec3 vPos;in vec3 vNormal;in vec2 vUV;out vec4 o;void main(){o=vec4(normalize(vNormal),-vPos.z);}`;
 const FRONT=`#version 300 es
 precision highp float;in vec3 vPos;in vec3 vNormal;in vec2 vUV;out vec4 o;
 uniform sampler2D uBack,uLogo;uniform float uLogoReady;uniform vec2 uRes;uniform mat4 uProj;uniform mat3 uToWorld;uniform float uDark,uBeam;uniform vec3 uBeamFrom;
 float box(vec3 d,vec3 l,float r){return smoothstep(cos(r),cos(r*.55),dot(d,normalize(l)));}
 // The Blender studio: a sky that is pale above and blue-grey below, and four soft boxes (key, fill, rim, top).
 vec3 sky(vec3 d){float f=clamp(d.y,0.,1.);
  vec3 c0=uDark>.5?vec3(.36,.50,.60):vec3(.62,.76,.85),c1=uDark>.5?vec3(.60,.76,.86):vec3(.76,.88,.95),c2=vec3(.88,.95,1.),c3=vec3(.97,.99,1.);
  vec3 c=f<.47?mix(c0,c1,f/.47):f<.53?mix(c1,c2,(f-.47)/.06):mix(c2,c3,(f-.53)/.47);c*=uDark>.5?.85:1.;
  c+=box(d,vec3(-.53,.53,.66),.42)*1.8+box(d,vec3(.74,.05,.66),.38)*.8*vec3(.86,.93,1.)+box(d,vec3(.34,.45,-.82),.36)*1.6*vec3(.9,.96,1.)+box(d,vec3(0.,1.,.03),.5)*.5;
  c+=uBeam*smoothstep(.985,.999,dot(d,uBeamFrom))*6.;return c;}
 void main(){vec3 N=normalize(vNormal),V=normalize(vPos);if(dot(N,V)>0.)N=-N;vec2 uv=gl_FragCoord.xy/uRes;vec4 back=texture(uBack,uv);
  float thick=back.w>0.?max(back.w+vPos.z,.02):.3;vec3 iors=vec3(1.44,1.47,1.51),col;
  for(int k=0;k<3;k++){float ior=iors[k];vec3 t1=refract(V,N,1./ior),p2=vPos+t1*thick;vec4 clip=uProj*vec4(p2,1.);vec4 b2=texture(uBack,clip.xy/clip.w*.5+.5);
   vec3 n2=b2.w>0.?normalize(b2.xyz):back.w>0.?normalize(back.xyz):-N;if(dot(n2,t1)<0.)n2=-n2;vec3 t2=refract(t1,-n2,ior);if(dot(t2,t2)<1e-4)t2=reflect(t1,-n2);col[k]=sky(uToWorld*t2)[k];}
  col*=exp(-thick*vec3(.28,.11,.05))*vec3(.94,.98,1.);
  float F=.04+.96*pow(1.-clamp(dot(-V,N),0.,1.),5.);vec3 c=mix(col,sky(uToWorld*reflect(V,N)),F)*.8;
  // Softer highlights and a little less saturation, then a soft light from the front and above.
  c=mix(vec3(dot(c,vec3(.2126,.7152,.0722))),c,.62);c=min(c,vec3(1.15));vec3 nw=uToWorld*N;c*=.6+.48*max(dot(nw,normalize(vec3(-.12,.62,.78))),0.);c=c/(c+vec3(.62))*1.5;vec3 g=pow(clamp(c,0.,1.),vec3(1./2.2));
  // The logo's own colour for this face (as in the Blender stills: 78% logo, 22% glass).
  vec4 logo=texture(uLogo,vUV);o=vec4(mix(g,logo.rgb,.78*logo.a*uLogoReady),1.);}`;
 const LIGHT_VS=`#version 300 es
 in vec2 aPos;in vec4 aCol;out vec4 vCol;void main(){vCol=aCol;gl_Position=vec4(aPos,0.,1.);}`;
 const LIGHT_FS=`#version 300 es
 precision mediump float;in vec4 vCol;out vec4 o;void main(){o=vCol;}`;

 function supported(){try{const gl=document.createElement('canvas').getContext('webgl2');return !!(gl&&gl.getExtension('EXT_color_buffer_float')&&root.PrismGlassModel);}catch{return false;}}

 const active=new Set();
 // Draws the glass on a canvas laid over the logo box `box` (the still image). Returns the controller.
 function mount(canvas,box,{intro=false,beam=true,yaw:startYaw=0,place='logo',interactive=true}={}){
  const model=root.PrismGlassModel,gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,antialias:true});
  if(!gl||!gl.getExtension('EXT_color_buffer_float'))return null;
  const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=(vs,fs)=>{const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;};
  const back=program(VS,BACK),front=program(VS,FRONT),light=program(LIGHT_VS,LIGHT_FS);
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  for(const [data,name,n] of [[model.positions,'aPos',3],[model.normals,'aNormal',3],[model.uvs,'aUV',2]]){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
   for(const p of [back,front]){const loc=gl.getAttribLocation(p,name);if(loc>=0){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,0,0);}}}
  // The logo texture: until it loads, the glass shows alone.
  const logoTex=gl.createTexture();let logoReady=0;{const img=new Image();img.onload=()=>{if(destroyed)return;gl.bindTexture(gl.TEXTURE_2D,logoTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.generateMipmap(gl.TEXTURE_2D);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);logoReady=1;schedule();};if(LOGO_URL)img.src=LOGO_URL;}
  const count=model.positions.length/3;
  const lightVao=gl.createVertexArray();gl.bindVertexArray(lightVao);const lightBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,lightBuf);
  gl.enableVertexAttribArray(gl.getAttribLocation(light,'aPos'));gl.vertexAttribPointer(gl.getAttribLocation(light,'aPos'),2,gl.FLOAT,false,24,0);
  gl.enableVertexAttribArray(gl.getAttribLocation(light,'aCol'));gl.vertexAttribPointer(gl.getAttribLocation(light,'aCol'),4,gl.FLOAT,false,24,8);
  // Model triangles with face normals, for the light path.
  const base=[];for(let i=0;i<model.positions.length;i+=9){const P=model.positions,a=[P[i],P[i+1],P[i+2]],b=[P[i+3],P[i+4],P[i+5]],c=[P[i+6],P[i+7],P[i+8]];base.push([a,b,c,v3.norm(v3.cross(v3.sub(b,a),v3.sub(c,a)))]);}
  let fbo=null,tex=null,depth=null,W=0,H=0;
  function targets(){if(tex)gl.deleteTexture(tex);if(depth)gl.deleteRenderbuffer(depth);if(fbo)gl.deleteFramebuffer(fbo);
   tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,W,H,0,gl.RGBA,gl.HALF_FLOAT,null);
   for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.NEAREST],[gl.TEXTURE_MAG_FILTER,gl.NEAREST],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);
   depth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,W,H);
   fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
  const U=(p,n)=>gl.getUniformLocation(p,n);

  // Motion state: yaw (radians) with velocity; the light fades between 0 and 1.
  // Each place (welcome guide, What's New, new tab) remembers whether its light was switched on or off.
  const lightKey='prism.glassLight.'+place;try{const saved=localStorage.getItem(lightKey);if(saved!==null)beam=saved==='1';}catch{}
  let yaw=intro?-2.4:startYaw,offset=0,vel=0,dragging=null,lastUser=-1e9,beamOn=beam,beamAmount=beam?1:0,raf=0,visible=true,onScreen=true,destroyed=false,last=performance.now(),frames=0,since=performance.now(),fps=0;
  // The logo's camera: rotation (rows) and translation map the pyramid into camera space (y down, z forward).
  const cam=model.camera,Rc=m3T(cam.rotation),viewRot=m3m(FLIP,Rc),tg=m3v(FLIP,cam.translation),toWorld=m3m(ZUP_TO_YUP,m3T(viewRot)),camDepth=cam.translation[2];
  function size(){const r=box.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),cw=r.width*SX,ch=r.height*SY;
   canvas.style.width=cw+'px';canvas.style.height=ch+'px';canvas.style.left=(box.offsetLeft+box.offsetWidth/2-cw/2)+'px';canvas.style.top=(box.offsetTop+box.offsetHeight/2-ch/2)+'px';
   const w=Math.max(1,Math.round(cw*dpr)),h=Math.max(1,Math.round(ch*dpr));if(w!==W||h!==H){W=canvas.width=w;H=canvas.height=h;targets();}}
  function frame(now){raf=0;if(destroyed)return;const dt=Math.min(.05,(now-last)/1000);last=now;size();
   const reduced=reducedMotion();
   // Released, the glass glides back to its resting pose (the nearest whole turn from `offset`, which turn() moves).
   if(!dragging){const home=offset+Math.round((yaw-offset)/(2*Math.PI))*2*Math.PI;
    if(reduced){if(now-lastUser>1200){yaw=home;vel=0;}}
    else if(now-lastUser>1200||intro){vel+=((home-yaw)*(intro?7:10)-vel*(intro?4.2:5.6))*dt;}else vel*=Math.pow(.25,dt);
    yaw+=vel*dt;}
   if(intro&&Math.abs(yaw)<.002)intro=false;
   beamAmount+=((beamOn?1:0)-beamAmount)*(reduced?1:Math.min(1,dt*7));
   draw();frames++;if(now-since>=1000){fps=frames*1000/(now-since);frames=0;since=now;}
   const resting=!dragging&&Math.abs(yaw-offset-Math.round((yaw-offset)/(2*Math.PI))*2*Math.PI)<1e-3&&Math.abs(vel)<1e-3;
   if(!resting||Math.abs(beamAmount-(beamOn?1:0))>.01)schedule();}
  function schedule(){if(!raf&&visible&&onScreen&&!destroyed)raf=requestAnimationFrame(frame);}
  function draw(){
   // Perspective, with the logo's focal length, centred on the logo box (which spans the logo's 1024 px).
   const near=camDepth-3,far=camDepth+3,proj=[cam.focal/(512*SX),0,0,0,0,cam.focal/(512*SY),0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
   const rot=m3m(viewRot,rotZ(yaw)),mv=[...rot[0],0,...rot[1],0,...rot[2],0,...tg,1],nm=new Float32Array([...rot[0],...rot[1],...rot[2]]);
   gl.bindVertexArray(vao);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);
   // Back faces: normal and depth of the far side of the glass.
   gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.BLEND);
   gl.useProgram(back);gl.uniformMatrix4fv(U(back,'uModelView'),false,mv);gl.uniformMatrix4fv(U(back,'uProj'),false,proj);gl.uniformMatrix3fv(U(back,'uNormal'),false,nm);gl.cullFace(gl.FRONT);gl.drawArrays(gl.TRIANGLES,0,count);
   // Front faces: refraction, dispersion and reflection.
   gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.useProgram(front);gl.uniformMatrix4fv(U(front,'uModelView'),false,mv);gl.uniformMatrix4fv(U(front,'uProj'),false,proj);gl.uniformMatrix3fv(U(front,'uNormal'),false,nm);
   gl.uniformMatrix3fv(U(front,'uToWorld'),false,new Float32Array(toWorld.flat()));gl.uniform2f(U(front,'uRes'),W,H);gl.uniform1f(U(front,'uDark'),isDark()?1:0);gl.uniform1f(U(front,'uBeam'),beamAmount);
   gl.uniform3fv(U(front,'uBeamFrom'),m3v(ZUP_TO_YUP,v3.mul(BEAM_DIR,-1)));gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,logoTex);gl.uniform1i(U(front,'uLogo'),1);gl.uniform1f(U(front,'uLogoReady'),logoReady);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(U(front,'uBack'),0);gl.cullFace(gl.BACK);gl.drawArrays(gl.TRIANGLES,0,count);
   gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
   if(beamAmount>.01)drawLight(proj,rot);}
  // The light, in canvas pixels: a white beam in, a soft line through the glass, a spectrum fan out.
  function drawLight(proj,rot){
   // The beam is fixed in the world (through the spin axis); the glass turns under it.
   const toView=p=>v3.add(m3v(rot,p),tg),worldToView=w=>v3.add(m3v(viewRot,w),tg),unspin=m3T(rotZ(yaw));
   const screen=v=>{const x=proj[0]*v[0]/-v[2],y=proj[5]*v[1]/-v[2];return [(x*.5+.5)*W,(1-(y*.5+.5))*H];};
   const path=lightPath(base,m3v(unspin,BEAM_FROM),m3v(unspin,BEAM_DIR));if(!path)return;
   const out=[],a=beamAmount,dark=isDark(),px2=H/(1024*SY)*cam.focal/camDepth; // canvas px per unit at the glass
   const toClip=([x,y])=>[x/W*2-1,1-y/H*2];
   // A soft band from p to q: transparent edges, colour c (premultiplied) along the middle.
   function band(p,q,half,c0,c1){const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*half,ny=dx/l*half;
    const P=[[p[0]+nx,p[1]+ny],[p[0],p[1]],[p[0]-nx,p[1]-ny]],Q=[[q[0]+nx,q[1]+ny],[q[0],q[1]],[q[0]-nx,q[1]-ny]],z=[0,0,0,0];
    for(const [i,j] of [[0,1],[1,2]]){const ci=i===1?c0:z,cj=j===1?c0:z,di=i===1?c1:z,dj=j===1?c1:z;
     out.push(...toClip(P[i]),...ci,...toClip(P[j]),...cj,...toClip(Q[i]),...di,...toClip(P[j]),...cj,...toClip(Q[j]),...dj,...toClip(Q[i]),...di);}}
   const pre=(rgb,al)=>[rgb[0]*al*a,rgb[1]*al*a,rgb[2]*al*a,al*a];
   const E=screen(toView(path.enter)),S=screen(worldToView(v3.add(BEAM_FROM,v3.mul(BEAM_DIR,-3)))),X=screen(toView(path.exit));
   // White beam in (with a faint shadow so it reads on light backgrounds).
   if(!dark)band(S,E,px2*.04,pre([.2,.28,.36],.08),pre([.2,.28,.36],.12));
   band(S,E,px2*.026,pre([1,1,1],.55),pre([1,1,1],.7));band(S,E,px2*.011,pre([1,1,1],1),pre([1,1,1],1));
   for(let i=1;i<path.inside.length;i++)band(screen(toView(path.inside[i-1])),screen(toView(path.inside[i])),px2*.012,pre([1,1,1],.5),pre([1,1,1],.5));
   // Spectrum fan out: a continuous wedge between neighbouring colours, bright at the glass and fading with distance.
   const L=1.6,ends=path.fan.map(d=>screen(toView(v3.add(path.exit,v3.mul(d,L))))),mids=ends.map(e=>[X[0]+(e[0]-X[0])*.4,X[1]+(e[1]-X[1])*.4]);
   const tri=(p,cp,q,cq,r,cr)=>out.push(...toClip(p),...cp,...toClip(q),...cq,...toClip(r),...cr);
   for(let i=0;i<ends.length-1;i++){const c0=spectrum(i/(ends.length-1)),c1=spectrum((i+1)/(ends.length-1)),edge=i===0||i===ends.length-2?.55:1,s0=dark?.7:.78,s1=dark?.5:.55;
    tri(X,pre(spectrum((i+.5)/(ends.length-1)),s0*edge),mids[i],pre(c0,s1*edge),mids[i+1],pre(c1,s1*edge));
    tri(mids[i],pre(c0,s1*edge),ends[i],pre(c0,0),mids[i+1],pre(c1,s1*edge));tri(mids[i+1],pre(c1,s1*edge),ends[i],pre(c0,0),ends[i+1],pre(c1,0));}
   gl.useProgram(light);gl.bindVertexArray(lightVao);gl.bindBuffer(gl.ARRAY_BUFFER,lightBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(out),gl.DYNAMIC_DRAW);
   // On dark backgrounds the light adds up like real light; on light ones it is laid over the page.
   gl.enable(gl.BLEND);if(dark)gl.blendFunc(gl.ONE,gl.ONE);else gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.TRIANGLES,0,out.length/6);gl.disable(gl.BLEND);}

  // Pointer: drag on the logo spins it (inertia on release); a click without a drag switches the light.
  const inside=e=>{const r=box.getBoundingClientRect(),m=r.width*.08;return e.clientX>r.left+m&&e.clientX<r.right-m&&e.clientY>r.top+m&&e.clientY<r.bottom-m;};
  const down=e=>{if(e.button!==0||!inside(e))return;e.preventDefault();dragging={x:e.clientX,t:performance.now(),moved:0,lastX:e.clientX,lastT:performance.now()};vel=0;intro=false;lastUser=performance.now();schedule();};
  const move=e=>{const host=box.parentElement;if(!dragging){if(host)host.style.cursor=inside(e)?'grab':'';return;}if(host)host.style.cursor='grabbing';
   const now=performance.now(),dx=e.clientX-dragging.lastX,r=box.getBoundingClientRect(),k=Math.PI/(r.width||100);yaw+=dx*k;dragging.moved+=Math.abs(dx);
   const dtm=Math.max(1,now-dragging.lastT);dragging.v=dx*k/(dtm/1000);dragging.lastX=e.clientX;dragging.lastT=now;lastUser=now;schedule();};
  const up=e=>{if(!dragging)return;const d=dragging;dragging=null;lastUser=performance.now();if(box.parentElement)box.parentElement.style.cursor=inside(e)?'grab':'';
   if(d.moved<4&&performance.now()-d.t<400){beamOn=!beamOn;try{localStorage.setItem(lightKey,beamOn?'1':'0');}catch{}}else if(!reducedMotion()&&performance.now()-d.lastT<80)vel=Math.max(-14,Math.min(14,d.v||0));schedule();};
  if(interactive){addEventListener('pointerdown',down);addEventListener('pointermove',move);addEventListener('pointerup',up);addEventListener('pointercancel',up);}
  const io=new IntersectionObserver(entries=>{onScreen=entries.some(e=>e.isIntersecting);last=performance.now();schedule();});io.observe(canvas);
  const vis=()=>{visible=document.visibilityState==='visible';last=performance.now();schedule();};document.addEventListener('visibilitychange',vis);
  const ro=new ResizeObserver(()=>schedule());ro.observe(box);
  const themeWatch=new MutationObserver(()=>schedule());themeWatch.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-motion']});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ctl.destroy();});
  size();schedule();
  const ctl={replay(){yaw=-2.4;intro=true;vel=0;schedule();},redraw:()=>schedule(),
   // Turns the resting pose by `angle` radians; the glass swings there with the same spring as after a drag.
   turn(angle){if(!Number.isFinite(angle))return;offset+=angle;intro=false;lastUser=-1e9;schedule();},toggleLight(on=!beamOn){beamOn=!!on;schedule();},
   stats:()=>({fps:Math.round(fps),yaw,rest:offset,light:beamOn,width:W,height:H}),
   destroy(){if(destroyed)return;destroyed=true;active.delete(ctl);cancelAnimationFrame(raf);io.disconnect();ro.disconnect();themeWatch.disconnect();document.removeEventListener('visibilitychange',vis);
    removeEventListener('pointerdown',down);removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
  active.add(ctl);return ctl;
 }

 // Lays a live glass canvas over an <img> (the Cycles still): the image keeps its place in the layout, hidden, and comes
 // back if WebGL2 is unavailable or the context is lost.
 function upgrade(img,options={}){if(!img||img.dataset.glass||!supported())return null;img.dataset.glass='1';
  if(img.parentElement&&getComputedStyle(img.parentElement).position==='static')img.parentElement.style.position='relative';
  const canvas=document.createElement('canvas');canvas.className='glass-logo';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;pointer-events:none;z-index:2';
  img.after(canvas);let ctl=null;try{ctl=mount(canvas,img,options);}catch(error){console.error(error);}
  if(!ctl){canvas.remove();delete img.dataset.glass;return null;}img.classList.add('glass-fallback');
  const destroy=ctl.destroy;ctl.destroy=()=>{destroy();canvas.remove();img.classList.remove('glass-fallback');delete img.dataset.glass;};return ctl;}

 const api={lightPath,refract,spectrum,SPECTRUM,SX,SY};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PrismGlass={...api,mount,upgrade,supported,active};
})(typeof window!=='undefined'?window:globalThis);

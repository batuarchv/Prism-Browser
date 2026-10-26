/* Prism site interactions: links, the live glass logo, liquid glass lenses, the feature spectrum and scroll reveals. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  // Scroll reveals.
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: .18 });
  $$('.reveal, .strike-list, .tile-memory').forEach(el => io.observe(el));
  
  // The logo: the same live WebGL glass prism that Prism draws on its new tab. Drag to turn it, click to switch the light.
  const still = $('#logo-still');
  let logoStarted = false, logo = null;
  const startLogo = () => {
    if (logoStarted || !window.PrismGlass?.supported?.()) return;
    logoStarted = true;
    const ctl = logo = window.PrismGlass.upgrade(still, { intro: false, beam: true, place: 'site' });
    if (ctl) { const stage = $('#logo-stage'); stage.classList.add('hinting'); setTimeout(() => stage.classList.remove('hinting'), 4200); }
  };

  // Intro: the dark page shows only "light."; at 0.5 s a beam of light crosses to the prism, which wakes as it is hit;
  // half a second later the rest of the page arrives.
  const root = document.documentElement;
  // The intro's beam is laid exactly over the beam the logo draws, so the light that arrives first is the light the prism
  // catches. The logo is mounted (still hidden) straight away so its beam can be measured.
  const aimBeam = () => {
    const b = logo?.beam?.(), canvas = $('#logo-stage canvas.glass-logo'), line = $('.intro-beam');
    if (!b || !canvas) return;
    const kx = canvas.offsetWidth / b.W, ky = canvas.offsetHeight / b.H;
    const sx = canvas.offsetLeft + b.from[0] * kx, sy = canvas.offsetTop + b.from[1] * ky;
    const ex = canvas.offsetLeft + b.to[0] * kx, ey = canvas.offsetTop + b.to[1] * ky;
    const angle = Math.atan2(ey - sy, ex - sx);
    // From the point where the beam meets the glass, back past the left edge of the window.
    const len = (ex + $('#logo-stage').getBoundingClientRect().left + 40) / Math.max(.2, Math.cos(angle));
    Object.assign(line.style, { left: `${ex - len}px`, top: `${ey - 1}px`, right: 'auto', width: `${len}px`, transform: `rotate(${angle}rad)` });
  };
  if (root.classList.contains('intro')) {
    startLogo();
    setTimeout(() => { aimBeam(); root.classList.add('beam'); }, 500);
    setTimeout(() => root.classList.add('prism'), 760);
    setTimeout(() => { root.classList.remove('intro', 'beam'); }, 1260);
  } else {
    root.classList.add('prism');
    if (still.complete) startLogo(); else still.addEventListener('load', startLogo, { once: true });
  }

  // A specular highlight on whichever glass surface the pointer is over.
  if (fine) {
    addEventListener('pointermove', e => {
      const g = e.target.closest?.('.glass');
      if (g) { const r = g.getBoundingClientRect(); g.style.setProperty('--mx', (e.clientX - r.left) + 'px'); g.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
    }, { passive: true });
  }

  // Nav tightens once the page scrolls.
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Hero window: it tips up to face you as it scrolls in, and leans a little toward the pointer.
  const device = $('#device');
  let lean = 0;
  const tilt = () => {
    const r = device.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * .75)));
    device.style.setProperty('--rx', ((1 - p) * 16).toFixed(2) + 'deg');
    device.style.setProperty('--s', (.92 + p * .08).toFixed(3));
    device.style.setProperty('--ry', lean.toFixed(2) + 'deg');
  };
  if (!reduced) {
    addEventListener('scroll', tilt, { passive: true }); addEventListener('resize', tilt); tilt();
    if (fine) device.addEventListener('pointermove', e => { const r = device.getBoundingClientRect(); lean = ((e.clientX - r.left) / r.width - .5) * 5; tilt(); });
    device.addEventListener('pointerleave', () => { lean = 0; tilt(); });
  } else { device.style.setProperty('--rx', '0deg'); device.style.setProperty('--s', '1'); }

  // Light / Dark / Top bar.
  const sw = $('.look-switch'), thumb = $('.look-thumb');
  const placeThumb = () => { const b = $('button[aria-selected="true"]', sw); thumb.style.width = b.offsetWidth + 'px'; thumb.style.transform = `translateX(${b.offsetLeft}px)`; };
  sw.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', sw).forEach(x => x.setAttribute('aria-selected', x === b));
    $$('.shot').forEach(img => img.classList.toggle('is-on', img.dataset.look === b.dataset.look));
    placeThumb();
  });
  addEventListener('resize', placeThumb); document.fonts?.ready.then(placeThumb); placeThumb();

  // Marquee.
  const words = [['Prism Shield', 'red'], ['Bypass censorship', 'orange'], ['Spectrum', 'yellow'], ['Sleeping tabs', 'green'], ['Clear view', 'blue'], ['Lens', 'indigo'], ['Beam', 'violet'], ['Chromium 152', 'red'], ['Split view', 'orange'], ['Picture in Picture', 'yellow'], ['40 spaces', 'green'], ['Touch ID passwords', 'blue'], ['Chrome extensions', 'indigo'], ['GPL-3.0', 'violet']];
  const run = words.map(([w, c]) => `<span><i style="--c:var(--${c})"></i>${w}</span>`).join('');
  $('.marquee-track').innerHTML = run + run;

  // Features: seven colours, one at a time. They advance on their own while in view; a click picks one and holds it.
  const list = $$('.feature'), shots = $$('.fshot'), rails = $$('.spectrum-rail i');
  let index = 0, timer = 0, held = false, visible = false;
  const DWELL = 5200;
  const countUp = (el, from, to, decimals = 0, ms = 1400) => {
    if (reduced) { el.textContent = (+to).toFixed(decimals); return; }
    const t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = (from + (to - from) * e).toFixed(decimals); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const show = i => {
    index = (i + list.length) % list.length;
    list.forEach((li, k) => { li.classList.toggle('is-on', k === index); $('.feature-head', li).setAttribute('aria-expanded', k === index); });
    const key = list[index].dataset.shot;
    shots.forEach(s => s.classList.toggle('is-on', s.dataset.shot === key));
    rails.forEach((r, k) => r.classList.toggle('is-on', k === index));
    $('#chip-name').textContent = $('.feature-name', list[index]).textContent;
    if (key === 'memory') countUp($('.memory-card .count'), 0, 60);
    $('#feature-frame').style.setProperty('--glow', getComputedStyle(list[index]).getPropertyValue('--c'));
    schedule();
  };
  const section = $('#features');
  const schedule = () => { section.classList.toggle('autoplay', !held && !reduced); clearTimeout(timer); if (!held && visible && !reduced) timer = setTimeout(() => show(index + 1), DWELL); };
  list.forEach((li, k) => $('.feature-head', li).addEventListener('click', () => { held = true; show(k); }));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); }, { threshold: .35 }).observe($('#spectrum-stage'));
  show(0);

  // Memory tile counts down from 2.0 GB once it is on screen.
  const memTile = $('.tile-memory .count');
  new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { countUp(memTile, 2, .8, 1, 2000); obs.disconnect(); } }, { threshold: .5 }).observe(memTile);

  // Liquid glass lenses (Chromium only: it is the one engine that runs SVG filters in backdrop-filter). Each glass
  // surface gets a displacement map shaped like its own rounded rectangle: the backdrop bends near the rim like a thick
  // lens, and red, green and blue bend by slightly different amounts, so edges pick up a faint spectrum.
  const chromium = !!navigator.userAgentData?.brands?.some(b => /Chromium/.test(b.brand));
  if (!chromium || reduced) return;
  const defs = $('#lens-defs');
  const mapFor = (w, h, radius, bezel) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
    const r = Math.min(radius, w / 2, h / 2);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      // Signed distance to the rounded rectangle and its outward normal.
      const px = x + .5 - w / 2, py = y + .5 - h / 2;
      const qx = Math.abs(px) - (w / 2 - r), qy = Math.abs(py) - (h / 2 - r);
      let dist, nx, ny;
      if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy) || 1; dist = l - r; nx = qx / l; ny = qy / l; }
      else if (qx > qy) { dist = qx - r; nx = 1; ny = 0; } else { dist = qy - r; nx = 0; ny = 1; }
      nx *= Math.sign(px) || 1; ny *= Math.sign(py) || 1;
      const inside = Math.max(0, -dist), k = inside < bezel ? Math.pow(1 - inside / bezel, 2.2) : 0;
      const i = (y * w + x) * 4;
      d[i] = 128 + nx * k * 127; d[i + 1] = 128 + ny * k * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0); return c.toDataURL();
  };
  let n = 0;
  const lens = el => {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight); if (w < 8 || h < 8) return;
    const key = w + 'x' + h; if (el.dataset.lensKey === key) return; el.dataset.lensKey = key;
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    const id = el.dataset.lensId || (el.dataset.lensId = 'lens' + n++);
    const scale = Math.min(70, Math.max(26, Math.min(w, h) * .55)), bezel = Math.min(28, Math.min(w, h) * .32);
    const href = mapFor(w, h, radius, bezel);
    const channel = (c, s) => `<feDisplacementMap in="SourceGraphic" in2="map" scale="${s}" xChannelSelector="R" yChannelSelector="G" result="d${c}"/><feColorMatrix in="d${c}" type="matrix" values="${c === 'r' ? '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0' : c === 'g' ? '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0' : '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0'} 0 0 0 1 0" result="c${c}"/>`;
    let f = document.getElementById(id);
    if (!f) { f = document.createElementNS('http://www.w3.org/2000/svg', 'filter'); f.id = id; defs.append(f); }
    f.setAttribute('x', 0); f.setAttribute('y', 0); f.setAttribute('width', w); f.setAttribute('height', h);
    f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML = `<feImage href="${href}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>${channel('r', -scale)}${channel('g', -scale * .92)}${channel('b', -scale * .84)}<feBlend in="cr" in2="cg" mode="screen" result="rg"/><feBlend in="rg" in2="cb" mode="screen"/>`;
    el.style.setProperty('--lens', `url(#${id})`);
  };
  const lensed = $$('[data-lens]');
  const ro = new ResizeObserver(entries => entries.forEach(e => lens(e.target)));
  lensed.forEach(el => ro.observe(el));
  document.documentElement.classList.add('lens-on');
})();

// Palette chips: pick a colour, jump to its feature.
document.querySelectorAll('.swatch').forEach((b) => b.addEventListener('click', () => {
  const head = document.querySelectorAll('.feature-head')[+b.dataset.feature];
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  head?.click();
}));
// Footer word: the light follows the pointer.
const fw = document.getElementById('footer-word');
if (fw && matchMedia('(hover: none)').matches) new IntersectionObserver(([e]) => fw.parentElement.classList.toggle('in', e.isIntersecting), { threshold: .6 }).observe(fw);
fw?.parentElement.addEventListener('pointermove', (e) => fw.style.setProperty('--fx', `${(e.clientX / innerWidth) * 100}%`));

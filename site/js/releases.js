/* Release notes page: reads Prism's releases from GitHub and shows them newest first, with a version rail beside them. */
(() => {
  const site = window.PrismSite || {};
  const list = document.getElementById('notes-list');
  const rail = document.getElementById('notes-rail');
  const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  // Just enough Markdown for release notes: headings, lists, paragraphs, bold, italics, code and links.
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  const markdown = (md) => {
    let html = '', para = [], inList = false;
    const flush = () => { if (para.length) html += `<p>${inline(para.join(' '))}</p>`; para = []; };
    const close = () => { if (inList) html += '</ul>'; inList = false; };
    for (const raw of md.replace(/\r/g, '').split('\n')) {
      const line = raw.trimEnd();
      let m;
      if (!line.trim()) { flush(); close(); }
      else if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { flush(); close(); const h = Math.min(m[1].length + 1, 4); html += `<h${h}>${inline(m[2])}</h${h}>`; }
      else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) { flush(); if (!inList) { html += '<ul>'; inList = true; } html += `<li>${inline(m[1])}</li>`; }
      else { close(); para.push(line.trim()); }
    }
    flush(); close();
    return html;
  };

  const date = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const render = (releases) => {
    releases = releases.filter((r) => !r.draft);
    if (!releases.length) throw new Error('none');
    list.innerHTML = ''; rail.innerHTML = '';
    releases.forEach((r, i) => {
      const version = r.tag_name.replace(/^v/, '');
      const id = `v${version}`;
      const c = colours[i % colours.length];
      // Bodies start with "# Prism 0.24.1 · title"; the title becomes the card's subtitle.
      let body = r.body || '';
      let title = (r.name || '').replace(/^Prism\s+[\d.]+\s*[·—-]?\s*/, '');
      const first = body.match(/^#\s+Prism\s+[\d.]+\s*[·—-]\s*(.*)\n/);
      if (first) { title = title || first[1]; body = body.slice(first[0].length); }
      body = body.replace(/^\*\*Download:\*\*.*$/m, '');
      const dmg = r.assets?.find((a) => /\.dmg$/i.test(a.name));
      const card = document.createElement('article');
      card.className = 'note glass'; card.id = id; card.style.setProperty('--c', `var(--${c})`);
      card.innerHTML = `
        <header class="note-head">
          <div>
            <p class="tiny note-meta"><span class="note-dot"></span>${esc(date(r.published_at || r.created_at))}${i === 0 ? ' · <b>Latest</b>' : ''}${r.prerelease ? ' · Pre-release' : ''}</p>
            <h2 class="note-version">Prism ${esc(version)}</h2>
            ${title ? `<p class="note-title">${inline(title)}</p>` : ''}
          </div>
          ${dmg ? `<a class="btn ${i === 0 ? 'btn-solid' : 'btn-glass glass'} btn-small" href="${esc(dmg.browser_download_url)}" download>Download ${esc(version)}</a>` : ''}
        </header>
        <div class="note-body">${markdown(body)}</div>
        <p class="note-foot tiny"><a href="${esc(r.html_url)}" rel="noopener">View on GitHub ↗</a></p>`;
      list.append(card);
      const a = document.createElement('a');
      a.href = `#${id}`; a.style.setProperty('--c', `var(--${c})`);
      a.innerHTML = `<span class="note-dot"></span><span>${esc(version)}</span>`;
      rail.append(a);
    });
    // Keep the rail in step with the release in view.
    const links = [...rail.children];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.hash === `#${e.target.id}`));
    }, { rootMargin: '-45% 0px -50% 0px' });
    list.querySelectorAll('.note').forEach((n) => io.observe(n));
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  };

  const fail = () => {
    list.innerHTML = `<article class="note glass"><h2 class="note-version">Couldn't reach GitHub</h2>
      <p class="note-title">The release notes live on GitHub. <a href="${esc(site.releasesOnGitHub || 'https://github.com/batuarchv/Prism-Browser/releases')}">Read them there ↗</a></p></article>`;
  };

  fetch(`${site.api}/releases?per_page=50`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(render)
    .catch(fail);

})();

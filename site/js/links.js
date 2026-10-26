/* Shared by every page: project links from config.js, and Download buttons that point straight at the newest DMG. */
(() => {
  const site = window.PrismSite || {};
  for (const a of document.querySelectorAll('[data-link]')) { const href = site[a.dataset.link]; if (href) a.href = href; }

  // The latest release, fetched once per visit. Until it arrives (or if GitHub can't be reached) Download opens the
  // latest release page, which always works.
  const KEY = 'prism-latest-release';
  const apply = (rel) => {
    const dmg = rel.assets?.find((x) => /\.dmg$/i.test(x.name));
    const version = rel.tag_name.replace(/^v/, '');
    for (const a of document.querySelectorAll('[data-link="download"]')) {
      if (dmg) { a.href = dmg.browser_download_url; a.setAttribute('download', ''); }
      a.title = `Prism ${version} for Mac`;
    }
    for (const el of document.querySelectorAll('[data-version]')) el.textContent = el.dataset.version.replace('{v}', version);
  };
  let cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(KEY)); } catch {}
  if (cached?.tag_name) apply(cached);
  else if (site.api) fetch(`${site.api}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rel) => { const slim = { tag_name: rel.tag_name, assets: rel.assets.map(({ name, browser_download_url }) => ({ name, browser_download_url })) };
      try { sessionStorage.setItem(KEY, JSON.stringify(slim)); } catch {}
      apply(slim); })
    .catch(() => {});
})();

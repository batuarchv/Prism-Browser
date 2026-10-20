'use strict';

const INSTAGRAM_HOME = 'https://www.instagram.com/';

function isInstagramURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'instagram.com' || url.hostname.endsWith('.instagram.com')) && !url.username && !url.password;
  } catch { return false; }
}
function externalURL(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}

function instagramMobileUserAgent(chromeVersion) {
  const major = String(chromeVersion || '').match(/^\d+/)?.[0] || '120';
  return `Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Mobile Safari/537.36`;
}

function createInstagramApp({BrowserWindow, parent, chromeVersion, onExternal = () => {}}) {
  if (typeof BrowserWindow !== 'function') throw new TypeError('BrowserWindow is required.');
  let window = null;
  let privateMode = false;
  let appSpace = 'personal';

  function open({session, isPrivate = false, space = 'personal'} = {}) {
    if (!session) throw new TypeError('An explicit Prism browser session is required.');
    if (window && !window.isDestroyed()) {
      if (privateMode !== isPrivate) close();
      else { window.show(); window.focus(); return window; }
    }
    privateMode = isPrivate;
    appSpace = space;
    window = new BrowserWindow({
      ...(parent && !parent.isDestroyed() ? {parent} : {}),
      title: 'Instagram · Prism', width: 452, height: 900, minWidth: 360, minHeight: 620,
      show: false, autoHideMenuBar: true, backgroundColor: '#ffffff',
      webPreferences: {session, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, allowRunningInsecureContent: false}
    });
    const current = window;
    const contents = current.webContents;
    contents.setUserAgent(instagramMobileUserAgent(chromeVersion), 'en-US,en;q=0.9');
    // Electron 44 crashes the main process (SIGSEGV) if device emulation is enabled before the page has a renderer,
    // so mobile screen metrics are applied once the first page has loaded.
    contents.once('did-finish-load', () => { if (!contents.isDestroyed()) contents.enableDeviceEmulation({screenPosition: 'mobile', screenSize: {width: 430, height: 844}, viewPosition: {x: 0, y: 0}, deviceScaleFactor: 2, viewSize: {width: 430, height: 844}, scale: 1}); });
    contents.setWindowOpenHandler(({url}) => {
      if (isInstagramURL(url)) contents.loadURL(url).catch(() => {});
      else if (externalURL(url)) onExternal(externalURL(url), isPrivate, appSpace);
      return {action: 'deny'};
    });
    const external = (event, url) => {
      if (isInstagramURL(url)) return;
      event.preventDefault();
      if (externalURL(url)) onExternal(externalURL(url), isPrivate, appSpace);
    };
    contents.on('will-navigate', external);
    contents.on('will-redirect', external);
    current.once('ready-to-show', () => { if (!current.isDestroyed()) current.show(); });
    current.on('closed', () => { if (window === current) { window = null; privateMode = false; } });
    contents.loadURL(INSTAGRAM_HOME).catch(() => {});
    return current;
  }

  function close() {
    const current = window;
    window = null; privateMode = false; appSpace = 'personal';
    if (current && !current.isDestroyed()) current.close();
  }
  return {open, close, isOpen: () => !!window && !window.isDestroyed(), isPrivate: () => !!window && privateMode};
}

module.exports = {INSTAGRAM_HOME, isInstagramURL, externalURL, instagramMobileUserAgent, createInstagramApp};

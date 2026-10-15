const IDLE_MS = 5 * 60 * 1000;
function normalizeAddress(input) {
  const value = String(input || '').trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) { try { return new URL(value).href; } catch { return null; } }
  if (!/\s/.test(value) && (/^[\w.-]+\.[a-z]{2,}(:\d+)?(\/|$)/i.test(value) || /^localhost(:\d+)?(\/|$)/i.test(value) || /^\d+\.\d+\.\d+\.\d+(:\d+)?(\/|$)/.test(value))) {
    return new URL((/^(localhost|127\.)/.test(value) ? 'http://' : 'https://') + value).href;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return null;
  return 'https://www.google.com/search?q=' + encodeURIComponent(value);
}
function canSleep(tab, activeId, now = Date.now(), manual = false) {
  return !!tab.view && tab.id !== activeId && !tab.keepAwake && !tab.audible && !tab.loading && !tab.dirty && !tab.frames && !tab.capturing && (manual || now - tab.lastUsed >= IDLE_MS);
}
module.exports = {normalizeAddress, canSleep, IDLE_MS};

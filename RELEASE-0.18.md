# Prism 0.18.0 beta

## Live backgrounds and compact panels

Settings, Extensions and Downloads now use one reusable in-browser WebContentsView above the website. The page underneath remains visible and running; no full-page blackout or screenshot capture is needed. These are not additional macOS windows. The surface is created on demand, hidden on close, and destroyed after 15 seconds idle. Cold opening includes creating that surface; this build does not claim zero startup cost.

The download popup is 344 px wide, shows the five newest download records, and uses compact Open/Reveal icons with accessible labels. The full Downloads settings section retains the longer history and manual AI rename action.

## Automatic download naming

New completed Personal/Work downloads automatically use the selected AI naming provider. The default is on-device Apple Intelligence. Settings → AI & assistants can disable automatic naming. Old downloads are never bulk-renamed. Private downloads are excluded. Naming requests are serialized, retain the file extension and never overwrite a target file. If the provider is unavailable or naming fails, the original file/name remains. Cloud naming requires your configured OpenAI API key and may incur API charges; its existing metadata-only request policy is unchanged.

## Gmail favorites

In Appearance, choose **Add Gmail to Favorites**, open Gmail in Prism and sign in. Hover its favorite for a compact preview of the first three displayed inbox threads, including sender, subject and a short snippet. This uses your existing browser sign-in, with no OAuth setup, second Gmail renderer or background polling.

Gmail must be awake and showing the inbox. Sleeping, signed-out, empty, or other-folder tabs offer Open inbox instead. The preview follows Gmail's displayed ordering, including the current inbox category; it is not an independent server-wide latest-message query. Preview data is cleared on close, is never persisted, and is unavailable in Private. This is a DOM adapter and may need updates if Gmail changes its markup. Validation used a local Gmail-shaped fixture; your real mailbox was not read.

## Memory and cache

Lean memory mode is enabled by default. It caps Chromium's disposable HTTP disk cache at 128 MiB on startup and Prism's preview/image cache at 2 MiB. Under estimated app memory pressure it sleeps up to two eligible idle tabs per existing 30-second sweep. Existing media, unsaved-form, capture, active-tab and protected-tab checks still apply.

Performance settings also offer **Release idle memory & disposable cache**, which releases up to four eligible idle pages and clears the normal session's HTTP cache. It does not delete cookies, passwords, local storage, IndexedDB or service workers. Disk-cache limits control disk storage; they are not a promise of equivalent RAM savings. Working-set estimates may include shared pages. There is no recurring cache purge or forced garbage-collection loop, which can cause reload cost and stutter.

## Validation and delivery

74 unit checks are covered (the changed panel lifecycle test was updated and rerun). A focused GUI pass verifies live background updates, no additional native windows, five compact downloads, surface reuse/cleanup, real on-device automatic naming, the three-row Gmail fixture and active-page preservation during memory cleanup. The download and Gmail panels were visually reviewed. Earlier full smoke scripts still assume panels live in the main renderer and need migration before using them as a release gate; this build used the targeted suite requested by the user.

Apple Silicon ad-hoc-signed beta ZIP. Installed copies are not overwritten. Updater publishing remains disabled pending the separately deferred signing/feed setup.

## References

[Electron WebContentsView](https://www.electronjs.org/docs/latest/api/web-contents-view) and [session cache APIs](https://www.electronjs.org/docs/latest/api/session) define the view and cache controls used here. [Electron's resource-cache guidance](https://www.electronjs.org/docs/latest/api/web-frame#webframeclearcache) cautions that repeated blind cache clearing can slow pages down.

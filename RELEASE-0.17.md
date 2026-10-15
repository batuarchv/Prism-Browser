# Prism 0.17.0 beta

This build restores the current user-supplied triangular Prism logo with a white app-icon background, removes the synchronous page screenshot from Settings opening, and uses the standard split-panel sidebar symbol. Panels use restrained borders, shadows and short motion. A tab-state race that could close a newly opened panel is fixed.

## Downloads and AI

Download start/completion notices animate softly and respect reduced motion. Completed downloads offer **Rename with AI**, followed by an editable suggestion and explicit Apply. The original extension is retained; existing files cannot be overwritten.

Apple Intelligence is the default on-device provider, started only for a request. An optional OpenAI provider accepts your own API key, encrypted locally. Only filename, MIME type and source page title are sent on request; file contents, full URLs and credentials are excluded. AI is disabled in Private. Settings → AI & assistants also opens ChatGPT and explains Siri Shortcuts actions. See [AI setup](AI-INTEGRATION.md).

## Passwords and payment cards

Click a supported login field to choose a saved account without the toolbar button. Suggestions belong to the browser, appear only after user interaction, require an exact HTTPS origin, and disappear on navigation. Selecting an account fills without submitting. Payment cards can be added in Passwords settings; storage is encrypted, the picker exposes only masked numbers, and CVC is never saved or filled. The dropdown is created on demand and released after 15 seconds hidden.

This uses Prism's imported/saved credentials, not direct access to the Apple Passwords vault. Automatic suggestions currently cover main-frame input fields; embedded cross-origin forms, shadow DOM and select-based card expiry fields need further compatibility work.

## Folders and fullscreen

Right-click a pinned folder to rename it, add a bookmark, or remove the folder while keeping its saved pages. F2 on a focused folder opens Rename. Renaming preserves nested imported folder paths, addresses and order; name collisions are rejected. Bookmark edits retain their position, and moving a favorite into a folder now removes it from the Favorites grid.

Video fullscreen is allowed for the visible web page in normal and Private spaces. The website occupies the entire window with no rounded inset while fullscreen; Escape, navigation and switching tabs restore the browser layout. Chromium's gesture and embedded-frame fullscreen policy still apply.

## Validation and remaining setup

- 71 unit tests pass, including folder preservation/collisions, masked card storage and AI filename safety.
- Full browser smoke suite, credentials regression and navigation/context-menu regression pass.
- Focused GUI: account selection, card filling without CVC, encrypted storage, settings opening with no page capture or extra native window, download activity and real Apple Intelligence rename pass. Five Settings openings measured 1–12 ms to return; this is a local timing measurement, not a universal frame-rate claim.
- Real playing-video fixture passes fullscreen sizing, Escape, tab switching and navigation. Folder editing was exercised through the actual UI.
- OpenAI requests are mocked in tests; no API key or paid request was used. Siri voice invocation requires the user's Shortcut setup and was not voice-tested.
- Auto-update publishing remains disabled as requested; signing/notarization and hosted feed configuration are still pending. The ZIP contains an ad-hoc signed Apple Silicon beta. Installed copies are not automatically replaced.
- On-device naming requires macOS 26+, a supported Apple Intelligence Mac and downloaded/enabled models. General web compatibility and complete localization of detailed help remain ongoing beta work.

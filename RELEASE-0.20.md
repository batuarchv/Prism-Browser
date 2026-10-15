# Prism 0.20 — two pages, one workspace

## Features

- **Copy page link:** Ctrl+Shift+C, also Command+Shift+C when the browser UI or page has focus. Copies the active pane's URL, not the page body. Available in Edit too.
- **Two-tab split:** toolbar layout button or View → Tabs & layout. Pick another open page and choose Side by side (vertical divider) or Top & bottom (horizontal divider). Drag the divider between 25–75%, use arrow keys in 5% steps, or double-click/Home to reset. Pane-title buttons focus either page; swap or end split from the strip. Selecting another page replaces the focused pane. Closing either pane, opening a blank tab or changing spaces ends split. Split is temporary rather than restored across restart.
- **Tidy and rename:** arrange unpinned open tabs by site, with one-level Undo. No tabs are closed. Right-click a tab to pin, rename, restore its original page title or pair with the current page. Custom names persist through navigation and normal session restore. Favorites keep their bookmark labels.
- **Inspect:** right-click → Inspect Element, View → Inspect page, or Command+Option+I. Chromium's managed in-page dock provides HTML, CSS, Console, Network and its own dock/resize controls. It opens on demand and closes when switching tabs. The custom DevTools host was rejected after validation; the supported managed dock is used.
- **Picture-in-picture:** View menu, page tools, or right-click a video. Uses the original native video player, without a duplicate browser tab or replaying the stream. Active PiP is protected from tab sleeping. A site's player/permissions can disallow PiP; the browser reports this instead of bypassing restrictions. Embedded players can be targeted from their video context menu.
- **Local profile:** a compact business-card design with name, email and favorite theme. Saving applies the theme. Connections open existing Gmail/ChatGPT/Gemini web sessions or the local password/API settings; they do not authenticate or link accounts themselves. No extra background pages are created. Profile data is hidden in Private. Mobile sync is deferred by explicit user choice.
- Whole-page and selected-text translation added to AI-ROADMAP.md, with reversible page changes and explicit provider/context choices planned.

## Validation

17 focused unit tests passed: split geometry, tidy preservation, profile validation, custom-name persistence, session recovery, page menus, tab selection and memory protections. Disposable-profile Electron checks passed: both split orientations, ratio changes, pane focus, two existing views reused, visible split sleep protection, title retention, URL copy, profile UI, real managed DevTools, native video PiP from a local generated stream, PiP source sleep protection, closing a partner, and Private-space exclusions. A separate inspector check confirmed a single BrowserWindow. Workspace/profile screenshots were reviewed. Some repeated screenshot captures failed with transient compositor errors; functional checks then completed without redundant captures.

No real email account, password vault, cloud AI service or mobile device was used in these tests. No numeric RAM reduction claim is made: PiP avoids a second page, while the original media page must stay awake. Inspector memory is allocated only on demand.

Package retains the icon resource copied from the user's latest build. Ad-hoc signed for Apple Silicon. Automatic update publishing remains unconfigured; the installed application is not replaced by this package.

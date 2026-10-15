# Prism 0.15.2

The welcome guide now includes an optional default-browser step, with a Make Prism default action, verified HTTP/HTTPS status, and a System Settings fallback. Development/test runs cannot register the Electron development executable. Packaged Prism declares its web schemes and accepts HTTP(S) links from other apps, including bounded queuing during startup. External links open in Personal rather than inheriting a Private session. No default setting is changed automatically.

Favorites, pinned tabs and bookmark rearrangements use short transform/opacity transitions. Drag sources gently fade and shrink; drop targets use a fine highlight. Structural animations are only computed when tab/bookmark order or grouping changes, limited to visible items, and released when finished. Both macOS Reduce Motion and Prism Reduce Motion suppress animations; there is no continuous animation timer.

Includes the 0.15.1 separate Settings/Downloads windows and favorite address-bar behavior. Fixed initial loading of dynamically added Settings panes. The focused live-Electron regression check now passes for these features, onboarding, animation cleanup and reduced motion. 55 unit tests pass. System default changes were mocked/disabled in tests; the actual macOS confirmation flow has not been exercised to avoid changing the user's choice.

Full live-Electron smoke suite passed, including the six-step welcome guide, extensions, downloads, password filling, sleeping/waking and Private isolation.

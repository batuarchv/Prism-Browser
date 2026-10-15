# Prism 0.11 — browser essentials

- Find in page with match count, forward/backward navigation, Enter/Shift-Enter and Escape. The compact search row reserves page space instead of covering the Chromium view.
- Reopen closed tabs with Shift-Command-T. Keeps up to 25 entries in memory, separated by Personal/Work; does not preserve form values or back/forward stacks. Private tabs are never retained.
- History with Command-Y or Settings → History. Records up to 2,000 distinct recent HTTP(S) URLs, removes URL credentials, supports search, opening, removing and clearing. Lists show up to 200 matching entries. Private never records or displays normal history.
- Settings → Site permissions lists saved camera, microphone, location and notification choices. Requests require the active normal tab, a secure origin (or loopback), a main frame and a still-current navigation. Choices apply to the exact origin and are shared by Personal/Work. Reset returns to asking; reload the site to terminate existing access. Unknown permissions, cross-origin frame requests and all Private requests remain blocked. macOS can independently deny access; real camera/microphone and location delivery are not yet validated.

This milestone does not add password editing, Apple Passwords synchronization, cross-browser cookie migration, back/forward session restoration, an updater or distribution signing/notarization. See the remaining sequence below in NEXT-IMPLEMENTATION.md.

## Validation

34 unit tests passed. The focused Electron suite passed match counting/next result, page bounds, history and permission panes, closed-tab recovery, history removal and Private isolation (`reports/basics-results.json`). Permission grant/rejection logic was tested with simulated prompts, including navigation changes and unsupported requests.

The broader smoke suite stopped at favorite-thumbnail capture: Electron reported “Current display surface not available for capture” on this host. Full visual regression and live device permission use remain unverified; this is a review build. The packaged app is locally ad-hoc signed, not notarized.

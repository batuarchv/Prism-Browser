# Account service milestone · 0.21.5

Local account server and desktop profile controls are implemented. See `services/prism-account/README.md` in the workspace for API and deployment roadmap. This is development-only: no real email verification, cloud hosting, iOS connection, favorites sync or password sync yet. Do not advertise it as live sync. Publish desktop builds using release-local as below.

# Latest: 0.21.4 — refined profile card

Current logo, light/dark satin card, name/email and immutable first-save date for new local profiles. Older undated profiles show Not recorded; do not invent their historical creation date. Publish all future releases via scripts/release-local.cjs for startup installation. See RELEASE-0.21.4.md.

# Latest: 0.21.3 — local startup updates and complete cleanup

Every finished desktop beta must use scripts/release-local.cjs to package, verify, sign and publish the local feed. Do not stop at producing a ZIP: the installed app checks this feed at startup. Preserve the existing private key outside the source tree; do not copy it into archives. See RELEASE-0.21.2.md. Public internet distribution still needs a hosted feed and Developer ID setup.

# Latest: 0.21.1 — everyday validation and panel memory

See RELEASE-0.21.1.md. Focused everyday fixtures and selected-text translation preview/copy passed. Closed panels release their renderer after 3 seconds; matched local memory measurements are in reports/MEMORY-0.21.1.md. Next: representative real-site and live-provider validation; whole-page replacement remains deferred. Do not conflate synthetic working-set sums with physical-memory savings or battery results.

# Latest: 0.21 — page assistance

Page summaries and selected-text translation implemented with preview, explicit OpenAI Send, cancellation and Private exclusion. See RELEASE-0.21.md. Next: live provider verification with explicit user context, Gemini adapter and streaming; reversible whole-page translation remains deferred. iCloud sync chosen for Apple devices, but provisioning is blocked by the current free Personal Team. Preserve latest icon.

# Latest: 0.20 — workspace and local profile

Implemented: Ctrl+Shift+C copies URL; two-tab split (side-by-side or stacked), adjustable divider and pane swapping; local tab organization and persistent display names; managed Chromium inspector; native video PiP with sleep protection; local name/email/theme profile and connection shortcuts. Profile sync is deliberately deferred by user choice. Translation remains on the AI roadmap.

Next: implement selection translation and page summarization behind explicit provider/context choices. For mobile sync, configure the service before implementing authentication, pairing, conflicts and encrypted records. Do not present the local profile email as verified identity or connection buttons as OAuth linking.

Use test/workspace-entry.cjs with a disposable --smoke-test profile for workspace/PiP checks. Native browser views are absent from shell-only capturePage screenshots; use view-specific capture or a composited screen capture when reviewing split visuals. Avoid broad repeated checks; validate changed behavior once and rerun failed portions only.

# Latest: 0.19

Sidebar gutters, MRU close selection and memory-prioritized sleeping are implemented. See RELEASE-0.19.md for validation limits and AI-ROADMAP.md for proposed next features. Do not redesign the user icon.

## 0.18.0 beta — live panels, automatic naming, Gmail and lean memory

Panels float above the live website. Quick downloads show five compact rows. New downloads are automatically AI-renamed; Gmail favorites preview three loaded inbox threads. Lean mode caps disposable cache and releases eligible idle tabs under pressure. See [release notes and limitations](RELEASE-0.18.md). Next: migrate legacy GUI scripts to the temporary panel view, expand Gmail markup compatibility from real-world reports, and measure memory over longer sessions. Publishing remains deferred.

## 0.17.0 beta — responsive panels, autofill, AI downloads, folders and fullscreen

Restored the current Prism logo; removed Settings screenshot latency and fixed a tab/panel race. Added automatic account/card suggestions, request-only AI download naming, soft download activity, folder editing and video fullscreen. 71 unit tests, full smoke and focused GUI regressions pass. See [release notes](RELEASE-0.17.md) and [AI setup and remaining compatibility work](AI-INTEGRATION.md). OpenAI requires a user API key, Siri requires a Shortcut, and updater publishing remains deferred.

## 0.16.0 beta — update preparation and interface controls

White app icon, responsive bordered favorites, pinned tab dragging, six interface languages, and disabled-until-configured beta updater. See [release notes](RELEASE-0.16.md) and [publishing setup](UPDATE-PUBLISHING.md). Publishing/signing configuration and complete translation of remaining detailed help/diagnostics are still pending.

# Prism 0.15.3 validated

GUI validation completed: focused panel/extension tests and the full browser smoke suite pass. Quick-extension screenshot visually inspected. Previous permission-review blocker resolved. Packaged app is outputs/Prism-Electron-0.15.3.zip. Installed app unchanged. See RELEASE-0.15.3.md in the Prism source directory.

# Current work: Prism 0.15.3 preview

In-browser animated panels replace native utility windows; compact extension toggles and smaller toolbar/favorites are implemented. 55 unit tests pass. GUI testing is pending because automatic permission review timed out twice. Installed app unchanged. See RELEASE-0.15.3.md in the Prism source directory.

# Current build: Prism 0.15.2

Default-browser onboarding and gentle tab/drag motion are implemented. 55 unit tests, focused GUI checks and full browser smoke checks pass. The previous 0.15.1 GUI blocker is resolved. Actual macOS default selection is left to the user. See outputs/Prism/RELEASE-0.15.2.md (or RELEASE-0.15.2.md within the source directory).

# Prism 0.15.1 preview

Separate Settings/Downloads windows, thinner page surround and restored favorite navigation. See RELEASE-0.15.1.md. 53 unit tests pass; final GUI tests are pending because Electron GUI launch exits 134 in this environment. Installed app unchanged.

# 0.15 handoff

Menu/favorite fixes complete; see RELEASE-0.15.md. Next: triage reports/ui-lint.json against the intended desktop scale, fix genuine contrast and tooltip gaps, then extend checks to dark/custom themes and keyboard interactions. Do not suppress findings globally or ship lintapple in the app.

# Prism 0.7 implementation guide

Priority: responsiveness and predictable memory use, then quicker explicit password fill and quieter navigation chrome. Keep the supplied Prism identity and existing profiles.

## This implementation
- Coalesce bursts of state notifications into one update per event-loop turn.
- Skip active, protected, busy and recently used tabs before running the isolated-world sleep probe. Revalidate eligibility and navigation after asynchronous probes. Prevent overlapping timer sweeps.
- Resize only the visible page; cache view bounds and visibility to avoid redundant native calls.
- Fill a single exact-origin saved account immediately after the user presses Fill; retain account selection for multiple matches. Never auto-submit, fill in Private, or relax HTTPS/navigation checks.
- Improve field selection for forms with search fields and explicit username autocomplete. Reject ambiguous forms and cross-origin form actions.
- Reduce toolbar to 52px and synchronize CSS and native page bounds. Refine address/search focus states and replace decorative search glyphs with existing icons.
- Debounce local address suggestions, clear stale suggestions on blur, and deduplicate results.

## Validation and delivery
Run unit tests, JavaScript syntax checks and the isolated Electron smoke suite. Extend password tests to cover direct fill, multiple accounts and navigation changes. Package 0.7 for Apple silicon and verify its signature/archive. Do not claim measured CPU/RAM savings without a repeatable before/after benchmark.

## Next passes
1. Record repeatable 20-tab memory, tab restore latency and idle CPU measurements using the local benchmark; retain engine/version and fixture caveats.
2. Add a configurable awake-tab budget with media, dirty form and capture protection; retain lazy session restore.
3. Add an accessible custom address suggestions panel with keyboard navigation and safe overlay handling for native page views.
4. Add find-in-page and reopen-closed-tab with Private lifecycle exclusions.
5. Replace multi-account native password dialogs with an origin-bound account picker and test username-first flows, navigation races and framework controlled inputs.
6. Audit thumbnail sizes and caches, settings rerenders and download progress frequency using measurements before introducing caches.

## Current implementation order — 5 October 2026

The active source is 0.13.0 (7 October 2026). Earlier plans below are historical; use this sequence for new work.

1. **Browser basics (0.11):** find in page, reopen closed tabs, bounded searchable history and exact-origin permission prompts/reset. Implemented; see RELEASE-0.11.md for limits and validation.
2. **Recovery and credentials (0.12):** implemented searchable encrypted-vault management, edit/reveal/delete, uncapped searchable account selection, bounded navigation/scroll snapshots, atomic replacement and last-good backup recovery. See RELEASE-0.12.md for limits and validation. Apple Passwords sync/native autofill remains research.
3. **Reliability and measurement (0.13):** thumbnail recovery, live resources, Low memory preset, clean-profile public/local workload measurements, synthetic-device permissions, virtual passkey creation/sign-in, passkey account choice, and forced-kill/restart/backup tests delivered. See RELEASE-0.13.md. Remaining: physical hardware/Touch ID, actual conferencing apps, representative store extensions, matched Arc/battery runs. The Private public-site and STUN probe was blocked by automatic approval review pending explicit network-metadata consent; DNS/comprehensive leak validation remains unverified.
4. **Distribution:** Developer ID signing/notarization, update strategy, default-browser registration, more polished Finder installer. Requires the appropriate signing account and certificates.

0.10 shipped an installer DMG plus first-run themes, bookmark import choices, password CSV import with progress and shortcut tips. Arc/Chrome bookmarks and Safari HTML exports are supported; direct cookie/sign-in/cache migration remains unimplemented. Figma integration is a local token/plugin handoff, not a hosted Figma design file.

## 0.7 validation result — 5 October 2026
All 18 unit tests passed, including four new password-fill controller regression tests. Main, renderer and customization JavaScript syntax checks passed. The isolated Electron smoke suite passed with Chromium 152.0.7977.130 / Electron 44.5.1, including suspension, wake, exact-origin fill, username-first fill, downloads, extensions, design controls and Private isolation/network lifecycle. No quantitative performance claim is made yet. Native multi-account dialogs and the platform datalist remain; their custom replacements are deferred above.

## 0.7.1 favorite tabs
Favorites now own a tab by bookmark ID in each browsing space. Clicking the symbol selects/wakes that tab, retaining navigation after redirects. Favorite tabs are represented by their highlighted symbol instead of a duplicate Open tabs row. The association survives session serialization; removing favorite status exposes the tab normally. Twenty unit tests and the Electron smoke suite passed, including repeated favorite clicks after navigation and active-symbol rendering.

## 0.8 performance-only pass
- Default soft awake-tab limit: 8, configurable to 4/8/16/32 or disabled under Performance. A 30-second sweep considers tabs idle for at least 60 seconds, oldest first, and applies the existing dirty form, media, iframe, capture, active and keep-awake guards. Protected pages can exceed the soft limit.
- Image cache capped to 200 entries / 4 MiB of encoded data. Images are transmitted only on cache changes or profile transitions; shell reload resets transport state.
- Duplicate thumbnail capture is prevented; captures are limited to once per URL per minute and at most 300 × 200 pixels.
- Favorites are not rebuilt on every tab selection. Settings and design editor controls are not rebuilt when their inputs are unchanged.
- Old builds/experiments moved to archive. Reports have a dedicated directory. Active dependencies and previous release retained for offline work and rollback.
- Measurements use local synthetic pages with an 8 MiB touched array per tab, not real browsing. Process working-set sums can double-count shared memory. No claim of lower per-page Chromium memory or reduced CPU usage is made.

## 0.9 search and themes
Replaced the platform datalist with an accessible local suggestions list for address and home search, including Search/Favorite/Bookmark/History labels, keyboard selection, pointer activation and Escape dismissal. Suggestions temporarily cover the native page surface and restore it when dismissed. Private receives no normal history or bookmark suggestions. Queries stay local until navigation/search submission.

Replaced the settings gear with a centered outlined symbol. Design Studio has Glacier, Matcha, Dusk, Clay, Rose and Graphite palettes, each with light/dark colors. Preset changes preserve geometry; custom palette colors are separately persisted and recoverable with My custom colors. Color editing and JSON import/export remain available.

## 0.9.2 persistent bookmark tabs and Private autostart
All saved bookmarks, including pinned labels and folder items, reuse identity-bound tabs and remain represented at their original sidebar location. Session restore retains their association.

Private begins in a blocked idle state. The first page waits for one shared Zapret startup; later requests reuse the helper. Explicit Stop stays blocked, Direct remains an explicit override, and startup/helper failures never fall back to Direct. End Private stops the helper and the next session starts lazily again.

Validation: unit coverage for concurrent startup, startup failure and explicit overrides. Electron verified actual helper autostart and process reuse. The installed tpws rejected loopback fixture destinations with ERR_SOCKS_CONNECTION_FAILED; these checks verify lifecycle and isolation, not successful public-site access or circumvention. Site compatibility remains unverified.
# Current follow-up after 0.14

0.14 ships integrated ad/tracker network filtering, main-document CSS hiding, per-site controls and isolated Private exceptions. See RELEASE-0.14.md. Next blocker work: verified atomic filter updates off the main thread; representative site compatibility; optional extended cosmetics only after measuring CPU/RAM. Keep one shared engine and preserve the Private guard. Do not claim universal/video-ad blocking. Previous public-site/STUN permission request remains unanswered.

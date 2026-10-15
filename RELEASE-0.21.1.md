# Prism 0.21.1 — everyday polish and measured panel release

- Labeled Split toolbar button, visible divider, and Layout / Swap / Done controls. Narrow windows retain compact icon controls. Pointer-capture loss ends dragging cleanly.
- Smaller profile card with clearer typography and borders in light/dark themes. Repeated browser state events no longer rewrite an unchanged profile preview. iCloud status reflects the chosen future route and current provisioning limitation.
- Selected text → right-click → Translate Selected Text, or View → Translate selected text. Opens selected context locally; choose a language and Send, then preview and Copy the result. No whole-page replacement. OpenAI API key required; ChatGPT sign-in is separate. Private and editable fields remain excluded.
- Closed utility panels now release their renderer after three seconds instead of fifteen. Rapid reopening can still reuse the panel. No new background model, process or indexing.

## Validation

Focused isolated Electron checks verified real pointer dragging, both split orientations, pane focus, PiP and its sleep protection, fullscreen entry/exit, favorite identity and saved URL, typed address opening a new tab, MRU close and reopen, two-account password suggestions, account selection/fill, masked card choices and navigation dismissal. All credentials were synthetic local HTTPS fixtures. Light/dark profile captures were reviewed.

Selected-text entry → Turkish output → preview → Copy → Clear passed end-to-end with a simulated provider. No live API request or real browsing content was used. Five page-menu unit tests and six assistant unit tests cover editable/password exclusions, explicit Send, Private, cancellation, changed navigation, missing key and bad responses. The test harness was corrected to observe fullscreen state rather than awaiting its unresolved JavaScript promise. Shutdown-only untrusted-sender logs appeared after one test's completed assertions; application IPC sender checks remain intact.

These checks use local fixtures, not a compatibility claim for every video site or login flow. Live translation quality and paid API access remain unverified.

## Memory

See reports/MEMORY-0.21.1.md and the before/after JSON files. The measured improvement is earlier release of a panel renderer, not lower per-tab Chromium memory. Keep existing dirty-form, active media, capture, split and PiP protections. Idle and media totals vary between runs; no battery or Arc comparison is claimed.

Apple Silicon; ad-hoc signed. Latest user icon unchanged. The installed browser and existing data are not replaced by packaging. Update publishing is not configured.

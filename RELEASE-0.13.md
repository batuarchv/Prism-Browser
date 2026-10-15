# Prism 0.13 — reliability and measured memory controls

## Changes

- Favorite thumbnails recover from a missing macOS compositor surface using one bounded redraw/retry on the visible page. Background rendering is not permanently enabled. Captures are discarded after navigation, replacement, clearing the cache or switching away; concurrent requests share their work. Selecting a favorite or switching to cards retries a missing preview.
- Performance settings now offer Low memory (four awake tabs, two-minute idle sleep) and Balanced (eight / five minutes), plus on-demand process memory and CPU estimates. Background, closed-panel and occluded-window polling pauses. Protections for active tabs, media, edited forms, frames and explicit keep-awake tabs remain.
- Connected Electron's passkey account-selection event to a user-confirmed native choice. Only a matching active main-frame request may complete; navigation, another tab or Private cancels it. No Touch ID entitlements or Apple Passwords/iCloud sync are added.

## Verification

- 44 unit tests pass.
- Strict Electron browser regressions include favorite screenshot capture again, with no capture skip option. They also cover memory presets/resource rendering, downloads, local extension content scripts and tab APIs, password safeguards, onboarding and Private helper lifecycle.
- Synthetic media devices verified camera/microphone request, allow, reset and block. Notification permission and simulated geolocation succeeded. Virtual passkey registration and sign-in succeeded after the account-selection fix. Physical devices, Touch ID, iCloud passkeys and real conferencing services remain unverified.
- A separate-process recovery test kills only a disposable test app with SIGKILL, reopens its profile, validates back history/scroll/lazy tabs and Private exclusion, then corrupts the primary file and verifies backup recovery.
- See [performance measurements](reports/PERFORMANCE-0.13.md) for local and public-page observations. No Arc superiority, per-page Chromium reduction or battery-life claim is made.

## Pending validation

Automatic approval review blocked the new Private requests to example.com/wikipedia.org and Google STUN probe because they could expose public IP/network metadata to those services. Explicit user approval has been requested; that test has not run. Existing local tests establish helper startup/reuse/failure blocking and cookie isolation, not public-site access, DNS safety or comprehensive WebRTC leak protection. The test is preserved as `test/private-public-flow.cjs` for an approved run.

Broader real extension compatibility, physical hardware, DNS routing, matched Arc benchmarking, Developer ID signing/notarization and automatic updates remain future work. This Apple silicon preview is locally ad-hoc signed.

## Reference material

Electron documents the [capture API](https://www.electronjs.org/docs/latest/api/web-contents/#contentscapturepagerect-opts) and [passkey account-selection callback](https://www.electronjs.org/docs/latest/api/session#event-select-webauthn-account). The automated authenticator uses the [Chrome DevTools WebAuthn domain](https://chromedevtools.github.io/devtools-protocol/tot/WebAuthn/). Implementations and tests were checked against the installed Electron 44.5.1 API declarations.

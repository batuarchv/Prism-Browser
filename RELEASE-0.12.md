# Prism 0.12 — credentials and session recovery

## Passwords

Settings → Passwords now has a searchable login manager. Edit a website, username or password; leave the password field empty to preserve the current password. Reveal is explicit, and closing the editor clears its fields. Edit tokens expire after two minutes. Deletion requires confirmation, and stale edits or duplicate accounts cannot overwrite another login.

The key button still fills a single exact-origin HTTPS account immediately. Multiple accounts open a searchable picker without the old 12-account limit. Moving to another tab or navigating cancels the pending choice. No automatic submission occurs. Private cannot access the vault. Lists and normal UI snapshots contain account metadata, never passwords; the vault remains encrypted through Electron safeStorage/macOS Keychain. This is not Apple Passwords synchronization, and editing/reveal does not add biometric authentication.

## Recovery

Normal sessions now store a bounded back/forward stack (up to 25 URL/title entries per tab) and the current main-frame scroll position. Tabs remain lazy until selected. Snapshots retain at most 150 tabs, use atomic replacement with a last-good backup, and fall back to that backup if the primary file is malformed. Existing URL-only sessions remain readable.

Writes are coalesced for 450 ms. Scroll is sampled every five seconds and on switching/sleeping/closing. Recent changes can be lost in a sudden crash; dynamic page layouts can affect restored scroll. Only URLs, titles and coordinates are restored, never Chromium pageState, form input or Private tabs. Extensions/internal-page history and scroll within nested frames are not restored. Closed-tab recovery retains the earlier URL-only behavior.

## Validation

- 39 unit tests passed, including stale credential edits, metadata secrecy, bounded navigation and corrupt-primary backup recovery.
- Electron HTTPS fixture: encrypted edit, explicit reveal and clearing on cancel, manager rendering, 15-account picker and real form fill, navigation cancellation and Private vault exclusion passed.
- Electron recovery fixture: disk snapshot, lazy session reconstruction, sleep/wake navigation and scroll restoration, and empty form fields passed.
- Broader Electron regressions passed with favorite page-thumbnail capture explicitly skipped after its strict test failed because the host display surface was unavailable. Shell UI screenshots were captured and inspected. Private network tests verify helper lifecycle/isolation; the installed helper rejects localhost fixtures, so these are not public-site connectivity tests.

The Apple silicon app is locally ad-hoc signed and is not notarized. Native Apple Passwords integration, passkeys, real-device permission testing, matched Arc performance measurements, update distribution and public-site Private-network validation remain future work.

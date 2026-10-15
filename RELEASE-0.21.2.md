# Prism 0.21.2 — local automatic beta updates

Prism checks the local release feed before opening a browser window when Automatic updates is enabled. A newer authenticated build is staged beside /Applications/Prism.app, verified, installed after the old process exits, and reopened. Profiles, cookies and the vault are not copied, deleted or migrated by the updater. A missing or invalid feed leaves the current browser available. Settings → Updates can check manually and request restart/install.

This is a single-Mac local beta channel, not internet distribution. Feed: ~/Library/Application Support/Prism Local Updates. The app pins an Ed25519 public key; the private publishing key is outside the source project and excluded from source archives. Manifests identify an Apple Silicon Prism version and archive hash/size. Installation checks the archive hash again after staging, validates codesign and bundle identity/version, and only replaces Prism.app in /Applications or ~/Applications. A failed swap/launch restores the old bundle. The previous app is retained in the transaction folder until the new app reaches its ready window. If a newly launched process crashes before readiness, the retained Previous.app is available for manual recovery; crash rollback is not automatic.

Local signing is ad-hoc plus the pinned release signature, not Apple Developer ID/notarization. Internet update publishing remains unconfigured. Keep the local feed accessible on this Mac. Removing a release file prevents that update from installing but does not remove browsing data.

## Build workflow

Use `npm run release:local` (or the bundled Node runtime on scripts/release-local.cjs) for every finished desktop beta. It packages, ad-hoc signs, verifies, creates the ZIP, and publishes the authenticated local manifest last. Run scripts/package-source.cjs for the companion source ZIP. Do not regenerate the private signing key: existing installations trust its corresponding public key. Never package or publish the private key.

## Validation

Eight local/remote updater tests passed: signed manifest identity/version/path validation, tampering, absent and malformed feeds, failed-version suppression, successful bundle replacement, launch-failure rollback, and the existing remote updater gates. Swap tests use disposable directories and a stub launcher; startup installation on the actual Applications bundle is validated separately when deploying the initial update-enabled release.

## Deployment result

A signed updater-enabled 0.21.1 bootstrap was installed once in /Applications. On launch, it consumed the authenticated local 0.21.2 feed, staged and verified the bundle, exited, replaced itself, and reopened 0.21.2. The real UI shows Automatic updates on and Local beta feed · Prism is up to date. Favorites/folders remain present; The first deployment exposed an Electron app.asar cleanup issue; 0.21.3 uses original-fs to remove the previous bundle. The replacement app passed codesign verification.

## 0.21.3 verified follow-up

The installed 0.21.2 updated itself to 0.21.3 on the next launch. The new UI showed 0.21.3, code signature verification passed, and healthy-start cleanup removed the previous bundle and transaction marker. The incomplete temporary backup from the first test was removed separately.

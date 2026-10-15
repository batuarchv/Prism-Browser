# Beta updates: preparation and activation

Publishing was explicitly deferred by the owner. `src/update-config.json` is disabled. Current beta ZIPs are manual-install, ad-hoc signed builds. The Updates pane truthfully shows setup pending.

## Before activating

1. Obtain and consistently use a Developer ID Application identity with the same Apple Team ID and bundle identifier (`local.prism.browser`, or migrate it deliberately before the first public release).
2. Choose an HTTPS host and a Squirrel.Mac JSON update feed. Do not put private credentials or tokens in URLs. Follow Electron's autoUpdater documentation: https://www.electronjs.org/docs/latest/api/auto-updater/ and Squirrel.Mac's server requirements: https://github.com/Squirrel/Squirrel.Mac . The server must select a newer, compatible arm64 beta for the requesting version and return no update for current versions. Preserve the old feed and release assets during rollout.
3. Configure feedURL, teamID and enabled in the shipped update-config.json. Runtime requires a valid Developer ID signature for that team before configuring the updater. Renderer requests cannot change the feed.
4. Increment package.json version for every distributable implementation. Package, sign all nested code correctly with hardened runtime/appropriate Electron entitlements, notarize and staple the app. This repository's local ad-hoc packaging is not a substitute for that signing workflow.
5. Run `node scripts/release-check.cjs /absolute/path/Prism.app`. This fails unless the app's signature, team, notarization staple and source/bundle versions match. Create the ZIP from this exact validated app; record its SHA-256. Upload the immutable ZIP before changing feed metadata. Never replace the binary under an existing version URL.
6. On a separate installation, validate old→new, current→no update, interrupted download/retry, wrong-signature rejection and canceled restart with unsaved forms/downloads. Confirm settings, password vault, profile and session survive. Only then publish the feed to users.

## Runtime behavior

Built-in Electron autoUpdater/Squirrel.Mac; no additional background renderer or extension. Enabled/configured checks begin after 60 seconds and then every six hours. Turning automatic checks off clears timers; manual checks remain available. Concurrent checks are suppressed. Downloaded releases wait for explicit Restart and install. Existing dirty-form/download confirmations and session flushing run first. Error state can be retried without crashing; URLs or error internals are not displayed.

## Per-implementation release checklist

Update version, release notes and tests; build the source and application ZIPs; verify signing; run the release gate for published builds; validate upgrade on a separate profile; publish immutable assets and then feed metadata. A code edit alone never silently deploys a build.

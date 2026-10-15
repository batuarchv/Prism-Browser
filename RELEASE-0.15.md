# Prism 0.15.0

Native page context menus now provide image copy/save/search, link actions, text search, editing, spelling suggestions, navigation and extension actions. Menus are constructed only on right click. Private uses its own tab space and download session; password selections are never offered to web search. Image URL search explicitly sends the selected public image URL to Google when chosen.

Favorites retain their saved URL. Same-site navigation includes subdomains; unrelated registrable domains (including separate private-suffix tenants such as github.io) detach the live page into a normal tab and leave a sleeping favorite at its saved URL. This preserves redirects and POST bodies without creating another live renderer. Legacy offsite favorite associations are repaired when reopened.

Fixed a destroyed-view race during tab navigation/closing. Set an explicit shell body height for predictable layout measurements. Production packaging omits development dependencies, source maps, TypeScript declarations, iconset sources and redundant raw filter lists. ASAR packs app resources; the installed bundle uses filesystem compression. No Chromium components or user profile data are removed.

## Lintapple

Installed lintapple 0.1.19 as an exact development dependency from npm. Run `pnpm lint:ui` to inspect the real Electron shell in an isolated temporary profile, reusing the installed Electron runtime without downloading another Chromium browser. Policy: `ui-policy.json`. Report: `reports/ui-lint.json`. Checks appearance, design and downloads at 800×560 and 1240×820, with the default light theme. This is a design baseline, not a clean bill of health: 463 findings remain, including repeated fractional font-size policy mismatches, spacing, tooltips, contrast and state/label checks. Transparent native glass also triggers root-background findings. Findings are not suppressed. Dark/custom themes and keyboard interaction paths remain to be audited. Lintapple and Playwright are not shipped in the app.

## Validation

52 unit tests passed. Local real-Electron context-menu/navigation checks passed: image clipboard, image address, selected text menu, same-site favorite reuse, offsite click/typed URL/redirect handling, POST-body preservation and no extra live renderer when leaving a favorite. Full smoke checks passed for extensions, downloads, encrypted password flow, native glass, sleeping/waking and Private isolation/helper lifecycle. No public Private/STUN probe was run. This release prevents extra renderer creation in the tested flow; it does not claim a measured overall RAM reduction.

Web image URL actions require HTTP(S); blob/data images support bitmap copying when available. UI lint findings remain follow-up work.

## Installed artifact

Installed /Applications/Prism.app is 302,388 KiB allocated (295.3 MiB), versus 309,960 KiB before (302.7 MiB). Signed bundle and ZIP integrity verified; packaged-ASAR navigation/menu checks pass. The ZIP is approximately 125 MiB. Existing running bundle retained temporarily at the path in reports/install-0.15.json because desktop UI control timed out. Quit and reopen Prism to activate 0.15; clean the prior bundle only after its old process exits.

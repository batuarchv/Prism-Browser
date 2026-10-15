# Prism 0.14 — built-in blocking

Enabled by default in Personal, Work and Private. EasyList and EasyPrivacy run in one shared Ghostery filtering engine in the browser process. No ad-block extension process, per-tab rule copies, request log, recurring update requests or DOM MutationObserver. Compiled rules occupy 4,172,729 bytes. Request counters are bounded and disappear when a tab renderer closes. Engine matching caches are disabled.

Use the shield beside the address bar or Settings → Ads & trackers. Pause an exact hostname, or disable protection globally. Normal exceptions persist; Private exceptions stay in memory and are cleared on End Private. Changes affect new requests immediately; reload for cosmetic changes/already loaded resources. Changing settings does not discard unsaved forms. The global switch applies to all spaces.

Private request filtering composes with the existing Zapret guard. Pausing protection cannot bypass stopped or failed Private networking. Extension onHeadersReceived hooks remain intact.

Network filtering includes ad/tracker requests, third-party conditions and list exceptions. Host-specific and base CSS hiding are applied to the main document. No scriptlet injection, extended selectors, DOM-dependent cosmetic rules, subframe CSS, HTML rewriting or guaranteed video-ad removal. This is useful protection, not universal blocking or anonymity. Rules are bundled offline with this build and currently updated with app releases, not automatically. Refresh both official source lists and run scripts/build-blocker.cjs before a future release.

Validation: 48 unit tests pass, including standard list matches, rule exceptions, Private exception isolation and fail-closed behavior. A real Electron/local HTTP test confirms blocked scripts never reach the server, ordinary scripts load, cosmetic hiding works, and site pause/re-enable works. The complete local browser smoke suite passes, including extensions, downloads, tab suspension, password filling and Private lifecycle.

Measured in a single isolated run: deserializing the shared engine took 17.5 ms, approximately 3.0 MiB heap / 8.2 MiB RSS delta (after module loading). A synthetic page with a deliberately 64 MiB advertising script used 91.5 MiB renderer working set with protection, versus 158.0 MiB paused. This demonstrates avoided allocation; it does not predict real-site savings or compare Prism with Arc. Re-enabling after loading the ad did not immediately reclaim all memory (150.9 MiB). See reports/blocker-0.14.json. No claim of measured battery savings.

The separate public-site/STUN Private test remains unrun, pending the earlier explicit approval request. This release does not change that status. Distribution remains Apple-silicon-only and ad-hoc signed, without Apple notarization.

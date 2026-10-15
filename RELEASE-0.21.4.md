# Prism 0.21.4 — personal profile card

Redesigned the local profile card with the user's current faceted Prism logo, a compact wordmark, a quiet theme-colored surface, restrained diagonal detail, name/email hierarchy and a separate creation-date footer. Supports light/dark palettes and long names/email addresses. Uses a small static image and CSS; no animation loop, extra renderer or AI-generated identity.

Creation dates are now recorded on the first save of a new local profile and retained on edits. Existing profiles that lack a date remain explicitly undated (Not recorded), rather than assigning a false account creation date. This is a local Prism profile, not a verified cloud account. The existing name, email and theme remain editable; the date cannot be overwritten through the profile-save action.

Five focused core tests passed. Disposable-profile Electron validation covered the original logo loading, automatic first-save timestamp, date preservation against an attempted overwrite, light/dark rendering, and long-text fit. Both theme screenshots were reviewed. Fixture screenshots use an example email and do not modify the actual user profile.

Published through the authenticated local beta feed. Quit and reopen the installed Prism to install this update automatically.

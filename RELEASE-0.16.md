# Prism 0.16.0 beta

- White app-icon background, generated from the existing geometric artwork; smaller ICNS asset.
- Sidebar labels are not selectable; editable fields remain selectable. Dragging a tab by its main button now works, and dropping into the pinned group pins it. Existing bookmark/folder dragging is retained.
- Favorites reflow into more columns as the sidebar grows, with a visible border in both themes.
- English, Turkish, Spanish, Portuguese and French plus Ukrainian interface choices in Appearance and the welcome guide. Common navigation, settings controls, update status and welcome steps switch immediately. Website titles, bookmarks, account names and filenames are preserved. Technical diagnostics and some detailed help remain in English in this beta; this is not a claim of complete localization.
- Prism → Check for Updates… and an Updates settings pane. Publishing is deliberately disabled. There is no update request, download or installer activity until a feed and stable Developer ID signing are configured. Automatic checks will run once after launch and every six hours when configured and enabled; installation requires an explicit restart and existing unsaved-input/download checks.

## Validation

61 unit tests pass, including locale settings and mocked updater lifecycle, unsigned/unconfigured fail-closed behavior, duplicate-check suppression and retry.
Real Electron GUI tests pass for language switching, unchanged user names, favorite borders/reflow and pinned drag/drop. Full local-fixture smoke suite passes. Context-menu, favorite-navigation, extension-panel and default-browser-onboarding regressions also pass. Light and dark screenshots were inspected.

## Release limitations

This build remains locally ad-hoc signed and is manually installed. Automatic download/signature/install behavior cannot be validated end to end until a signed, notarized release and real beta feed exist. No public update server was configured or contacted. See UPDATE-PUBLISHING.md for the release procedure.

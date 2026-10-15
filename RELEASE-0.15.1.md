# Prism 0.15.1

Restores favorite identity during website links, redirects and form submissions. Only submitting a different address through the address bar opens a normal tab, preserving the favorite tab and bookmark URL. Submitting the same address reloads the favorite.

Settings, Extensions, History and other preference panes now use a reusable nonmodal Prism window. The sidebar Downloads shortcut opens a separate compact window, while the full Downloads pane remains in Settings. Windows are created lazily and destroyed on close. Their IPC is restricted to registered local window main frames. Website views remain visible behind these windows.

Website views have native 10-point rounded corners, with a thinner 6-point right/bottom surround. The address bar has a finer border and is slightly shorter. The keep-awake toolbar control now provides feedback and is disabled on empty tabs; Extensions opens its own Settings window.

Validation: 53 unit tests passed. Prior GUI inspection confirmed the new windows rendered; the focused test found a focus/suggestion overlay issue on returning to the main window. The source now blurs/dismisses suggestions before opening windows. Final focused and full GUI tests could not launch in the current sandbox (Electron exited 134), so that correction and final visual behavior still need a GUI test. This is not a fully GUI-verified release.

Delivery: preview package only. The installed /Applications/Prism.app was not replaced by this release because final GUI validation remains blocked.

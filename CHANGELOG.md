# Changelog

All notable changes to Prism, newest first. Downloads are on the [Releases page](https://github.com/batuarchv/Prism-Browser/releases).

## 0.38.2 — A glass swipe arrow

### New
- **Liquid glass swipe arrow.** The back and forward arrow that follows a two-finger swipe is now a small piece of glass, and it fills with your space's colour (or your theme's accent) once letting go would go back or forward. It follows light and dark mode.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.38.1 — Beam works again

### New
- **Beam is fixed.** In 0.37 and 0.38 Beam showed no results as soon as you typed, because it asked the clipboard for something this version of Prism's engine can't provide. Results, Ask Apple Intelligence and Ask Claude all work again.
- **Better answers.** Plain questions are always answered instead of being turned into an action, and Apple Intelligence gets a shorter, clearer list to choose from.
- **Paste an image into Beam** to search with it in Google Lens.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.38.0 — Beam with Apple Intelligence

### New
- **Ask Apple Intelligence in Beam.** With Apple Intelligence chosen in Settings → AI & assistants, Beam's assistant runs on your Mac: ask a question and it answers, or ask for something and it switches to the right tab, opens the page or runs the action. No API key needed.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.37.0 — Beam gets smarter

### New
- **Right-click to paste.** Prism's own fields, like the address bar, Beam, Settings and popovers, now have Cut, Copy, Paste, Select All and spelling suggestions. The address bar adds Paste and Go.
- **Ask Beam anything.** With Claude chosen in Settings, type a question or a request in plain words: Beam switches to the right tab, opens the right page or runs the right action, or answers right there.
- **Search with a picture.** Choose Search with an image in Beam, or paste an image into it, and Google Lens shows what it is in a new tab.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.36.0 — The biggest Prism yet

### New
- **Prism Shield.** Blocks ads, trackers and cookie banners, removes YouTube's video ads, and strips tracking tags from links, with no extension running.
- **Spaces you make your own.** Up to 40 spaces, each with its own tabs, icon and colour; swipe the sidebar to move between them.
- **Spectrum, redesigned.** Your day as one line of light: hover for a glance at your tabs then, click to see your day in chapters and bring tabs back.
- **⌘T is Beam.** Type an address, search, or jump to any tab, setting or action; links open in the background with a middle click.
- **Claude for Prism's AI.** Use your Anthropic API key for download names, page summaries and translations, and Spectrum.
- **Split view, Lens and Picture in Picture.** Drag a tab onto the page to split it, Shift-click a link to peek at it, and float videos above every app.
- **Tabs that stay ready.** Pinned tabs, favorites and the tabs you use often stay awake, and sleep only when your Mac needs memory.
- **Release notes in a tab.** Everything new since Prism 0.24.1, in one page you can read any time (Prism menu → Release Notes).

### Also new
- **Spectrum details.** Long pauses shrink to a short break so the line is about your time, the day card has a rainbow edge, and a click anywhere else closes it.
- **What's New, ranked.** This window now shows the most important changes first, with a line about each.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.35.1 — Quicker favorites

### New
- **Glass only where you are.** A favorite gets the liquid glass look only while its page is the one in front.
- **Icons without a visit.** Favorites and pinned bookmarks fetch their site icon in the background, so they show their logo before you open them.
- **Faster icons and preview cards.** A new icon or card reaches the sidebar on its own instead of resending every stored picture, and they're saved in the background instead of rewriting the whole file each time.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.35.0 — Faster hands

### New
- **Open in background.** Middle-click or ⌘-click a link and it opens next to your tab and starts loading while you stay put. Open Link in Background Tab is now first in the link menu.
- **⌘T is Beam.** Type an address, search, or jump to any tab, Settings page, the Chrome Web Store and more. ⌘K opens a blank tab.
- **Middle clicks in the sidebar.** Middle-click a tab to close it. On a pinned tab or bookmark, one middle click closes its page and two remove it (⌘Z brings it back).
- **YouTube stays connected.** Shield no longer blocks the requests YouTube uses to check your connection and keep playback steady, and never blocks video data.
- **Subtle liquid glass.** Favorites, toolbar and sidebar buttons, the current tab and Settings icons now have a soft glass highlight.

### Also new
- **Simple addresses.** The address field shows just the site's name until you click it (Settings → Appearance).
- **Passwords in Private.** Optionally fill saved passwords and cards in Private, after Touch ID (Settings → Passwords). Private never saves new ones.
- **Private protections everywhere.** Optionally keep no history or Spectrum, hide your local address from video calls and use encrypted DNS in every space (Settings → Prism Shield).
- **Tidier details.** Lens's close button is on the left, and Reload spins only its arrow.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.34.0 — A watch on Chromium

### New
- **Newest Chromium 152 security build.** Prism moves to Electron 44.9.3 with Chromium 152.0.7977.167, which has the latest security fixes for this Chromium.
- **Chromium update check.** Each time Prism opens, it compares its Chromium with the newest Chrome and Electron releases. Settings → Updates shows the result, and a quiet note appears once when a newer Chromium is ready for Prism. Only public version lists are requested, and you can turn it off.

### Also new
- **More reliable Settings, popovers and suggestions.** They no longer wait for a hidden page to finish loading before they appear.
- **Extension buttons work when the extension is asleep.** Prism wakes an extension's background worker before deciding what its button does.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.33.2 — Tabs that stay ready

### New
- **Fewer reloads.** Prism used to think memory was short as soon as a few modern sites were open, and put tabs to sleep, so they reloaded when you came back. It now asks macOS, and only puts tabs to sleep for memory when your Mac is really running short.
- **Your everyday tabs stay awake.** Pinned tabs, favorites and tabs you return to often get much longer before they sleep (at least 20 minutes), and they're the last to go when Prism needs memory.
- **Sleeping tabs come back faster.** Lean memory mode now keeps up to 1 GB of web cache on disk instead of 128 MB, so a sleeping tab reloads from your Mac instead of the network.
- **Ready before you click.** Pointing at a sleeping tab starts waking it in the background.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.33.1 — Fast again

### New
- **YouTube and X work again.** Shield's page scripts were overwriting each other, which broke YouTube and parts of X. Each one now runs on its own, and YouTube's ads are still removed.
- **A much lighter Shield.** Looking up a request in Shield's rules is about 30 times faster, so Prism's main process stays free for the window and your tabs.
- **No more runaway pages.** When a page asks for a blocked ad again and again (CNN did it 8,000 times a second), Prism now answers more and more slowly, so the page settles down.
- **Less work in the background.** Shield reads a page only when the page is idle, the Spectrum spark no longer animates all the time, and Apple Intelligence names your day only when you open Spectrum.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.33.0 — A stronger Shield, a smarter Spectrum

### New
- **Prism Shield blocks YouTube ads.** Sixteen filter lists (EasyList, EasyPrivacy, uBlock Origin and more) with uBlock's page scripts, which remove the ads inside YouTube videos. Cookie banners are hidden too.
- **More private links.** Shield strips tracking tags like utm_ and fbclid from links, tells sites not to sell your data (Global Privacy Control), and swaps blocked analytics scripts for harmless stand-ins so pages keep working.
- **Spectrum tells the story of your day.** It splits today into chapters, names them with Apple Intelligence on this Mac, and suggests the sites you usually open at this hour. The band now glows like light through a prism.
- **Pinned tabs stay put.** Closing a pinned tab unloads it and keeps it in the sidebar; its button then removes it.
- **⌘Z brings it back.** Outside a text field, ⌘Z (or ⌃Z) restores the last tab, favorite or pinned tab you closed, in its old place.
- **Close a favorite's tab.** Right-click a favorite and choose Close tab; the favorite stays.

### Also new
- **New names.** Ads & trackers is now Prism Shield, Peek is Lens, the command bar is Beam (⌘K) and compact mode is Clear view (⌥⌘S).
- **Restart to Update** now sits in the middle of the sidebar footer.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.32.1 — A tidier sidebar address bar

### New
- **Page tools behind Settings.** With the address bar in the sidebar, the Settings button opens a small glass menu: protection, bookmark, passwords, keep awake, extensions and split view as live tiles, with Settings itself at the bottom.
- **You can see where they went.** When you switch the address bar into the sidebar, the toolbar icons glide down into the Settings button.
- **A cleaner sidebar.** No separate New tab button next to the address field (⌘T still opens one), and End Private is now a small icon beside the space name.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.32.0 — Arc's best ideas, made for Prism

### New
- **Address bar in the sidebar.** Settings → Appearance → Address bar → In the sidebar puts the address field where New tab was, with back, forward and reload beside the window buttons, so the page reaches the top of the window.
- **Peek.** Shift-click a link to open it in a floating glass window over the page. Links to other sites from pinned tabs and favorites open there too. Press Esc to close it, or ⌘Return to keep it as a tab.
- **Command bar.** Press ⌘K to find any open tab, favorite, bookmark, archived tab or page from your history, or to run an action like Split view, Compact mode or switching spaces.
- **Spectrum.** Today shows as a thin band of light at the foot of the sidebar, with one colour for each site you were on. Hover it to see the time, or click it to bring back the tabs you had open then.
- **Picture in Picture, like Safari.** A video floats in a small rounded window above every app, snaps to a corner and shows its controls when you hover. It starts on its own when you leave a playing video's tab and returns when you come back.
- **Media in the sidebar.** When a tab you left is playing, play/pause, ±10 seconds and Picture in Picture wait above the footer.

### Also new
- **Archive.** Sleeping tabs you haven't opened for a day move to Archived under your tabs; one click brings one back. Pinned tabs and favorites always stay (Settings → Performance).
- **Compact mode.** ⌥⌘S hides the sidebar and toolbar; move to the left edge of the window to bring them back.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

## 0.31.1 — Everything new since 0.24

This release brings together everything from 0.25 to 0.31.

### New
- **Make your own spaces.** Up to 40 spaces, each with its own name, icon and colour; jump between them with ⌃1 to ⌃9 or a two-finger swipe on the sidebar.
- **Much lighter on memory.** Idle tabs now really go to sleep, so ten busy sites drop from about 2 GB to 0.8 GB once you leave them.
- **Drag a tab onto the page to split.** Drop it on the left, right, top or bottom half to open it next to the page you're on.
- **Passkeys with Touch ID.** Sites can create and use passkeys, approved with Touch ID and kept encrypted on this Mac; saved logins fill after Touch ID too.
- **Site controls.** Click the lock in the address bar for this site's permissions, zoom, cookies and Picture in Picture, or to erase parts of a page.
- **Swipe and pinch.** Swipe with two fingers to go back and forward, pinch to zoom, and right-click a word to look it up.
- **Extension panels.** Extensions with a popup or a side panel, like Claude, open under the toolbar's Extensions button or docked beside the page.
- **A live glass logo.** The Prism logo is a real 3D glass pyramid now: drag it to spin it, click it to send light through it.
- **Quicker and tidier.** Popovers open instantly and close when you click away, tabs and favorites drag smoothly, and Settings looks like macOS.
- **Smoother updates.** A quiet ring in the sidebar shows an update downloading, a small Restart button installs it, and this window shows what changed.

### Also new
- **Close all tabs** with the button beside Open Tabs; Undo or ⇧⌘T brings them back.
- **Sign-in pages see a standard browser.** Prism identifies as Chrome, so Apple and Google sign-in treat it like any supported browser.
- **Space colours** tint the accent and, faintly, the sidebar; right-click the space name to customize the current space.
- **A calmer new tab.** With every tab closed, the logo sits in the middle and recently closed tabs wait at the bottom.
- **Favorite icons stay visible.** One-colour logos that would vanish against the sidebar are shown in the opposite tone.
- **Faster page loads from the address bar.** Prism connects to the site you're most likely going to while you type.
- **Accessibility.** VoiceOver hears whether a popover is open, focus returns to its button after Esc, and the tab list works with the arrow keys and ⇧F10.

### Fixed
- **Swiping between spaces** is smooth again: a second swipe right after the first is no longer ignored, slowing down mid-swipe no longer snaps back, and the old space no longer flashes.
- **Uploading files** on sites that use the newer file picker works again.
- **Busy pages** that keep changing their title no longer make the sidebar redraw several times a second, and history is saved in batches.

## 0.31.0 — Snappier and easier to use

### New
- **Drag a tab onto the page to split.** Drag any tab from the sidebar over the page: drop it on the left, right, top or bottom half to open it next to the current page, or in the middle to just switch to it. Esc cancels.
- **Tabs move smoothly.** Dragging a tab in the sidebar lifts it and the other tabs slide aside to show where it will land, like favorites. With the keyboard, ↑ and ↓ move between tabs, ⌥↑ and ⌥↓ move the tab, and ⇧F10 opens its menu.

### Improved
- **Popovers open at once.** Spaces, Downloads, Extensions and Settings are kept ready in the background, so they appear without the short wait they had before.
- **Popovers close the way you expect.** Click the button again, or click anywhere else in the window, and the popover closes. After closing one with Esc, the keyboard focus goes back to the button that opened it.
- **Faster page loads from the address bar.** While you type, Prism opens a connection to the site you're most likely going to, so it starts loading sooner when you press Return.
- **Spaces.** The edit button on each space is always shown and easier to hit, and pressing it no longer starts dragging the space. The space icon next to the logo no longer has a tinted square behind it.
- **Favorites dragging** follows the pointer more reliably and lands without a jump.
- **Accessibility.** Popover buttons tell VoiceOver whether their popover is open, and the site settings button in the address bar has a bigger target.

## 0.30.0 — Lighter and quieter

### Improved
- **Idle tabs really sleep now.** Tabs you haven't used for a while are put to sleep to free memory, but any page with an embedded frame (an ad, a video embed, a sign-in widget) used to stay awake forever, which is almost every site. Now only frames with something to lose keep a tab awake: a half-filled form, playing media or picture-in-picture. With ten busy sites open, Prism used about 2 GB; once they idle it drops to about 0.8 GB.
- **Less work in the background.** Pages that keep changing their title (tickers, unread counters) no longer redraw the sidebar several times a second, and history is saved in batches instead of rewriting the whole file on every title change.

## 0.29.1 — Spaces you make your own

### New
- **Make your own spaces.** Click the space name next to the logo to open Spaces: every space with its tab count, a search field once you have more than six, and New space. Press ⌃1 to ⌃9 anywhere to jump to the first nine (they're in the Spaces menu too). Drag spaces in the list, or press ⌥↑ and ⌥↓, to reorder them; swipes follow the same order.
- **Customize a space.** Give it a name, one of 40 icons and a colour: your theme's accent, one of the theme colours, or any custom colour with the colour picker or a hex value. Changes show as you make them. Right-click the space name to customize the current space. Deleting a space asks first, right in the window, and says how many tabs will close.
- **Space colours.** The current space's colour tints the accent and, faintly, the sidebar.
- **The logo turns with you.** Each time you switch spaces, the glass logo in the corner turns 60° in 3D.

### Fixed
- **Uploading files.** Upload buttons on sites that use the newer file picker did nothing after you chose a file. They work now.

## 0.29.0 — Spaces you make your own

### New
- **Make your own spaces.** Click the space name next to the logo to open Spaces: every space with its tab count, a search field once you have more than six, and New space. Press ⌃1 to ⌃9 anywhere to jump to the first nine (they're in the Spaces menu too). Drag spaces in the list, or press ⌥↑ and ⌥↓, to reorder them; swipes follow the same order.
- **Customize a space.** Give it a name, one of 40 icons and a colour: your theme's accent, one of the theme colours, or any custom colour with the colour picker or a hex value. Changes show as you make them. Right-click the space name to customize the current space. Deleting a space asks first, right in the window, and says how many tabs will close.
- **Space colours.** The current space's colour tints the accent and, faintly, the sidebar.
- **The logo turns with you.** Each time you switch spaces, the glass logo in the corner turns 60° in 3D.

### Fixed
- **Uploading files.** Upload buttons on sites that use the newer file picker did nothing after you chose a file. They work now.

## 0.28.1 — Picture in Picture in site controls

### New
- **Picture in Picture in site controls.** Once a site plays video in Picture in Picture, it appears in the site controls next to camera, microphone and location, where you can block it for that site.

## 0.28.0 — passkeys with Touch ID, site controls

### New
- **Passkeys with Touch ID.** Websites can create and use passkeys in Prism. Touch ID approves each one; they are kept encrypted on this Mac and listed in Settings → Passwords.
- **Touch ID sign-in, including Apple Account.** The key button fills your saved login after Touch ID, also in sign-in forms embedded from the account's own site, like Apple Account's.
- **Sign-in pages see a standard browser.** Prism now identifies as Chrome, so Apple and Google sign-in pages treat it like any supported browser.
- **Site controls.** Click the lock in the address bar for this site's permissions, page zoom, cookies and site data, and cache.
- **Erase elements.** Hide parts of a page you don't want to see; ⌥-click hides every similar one. Prism remembers them for the site, and Restore brings them back.

## 0.27.5 — the logo is the pyramid

### New
- **The logo is a true pyramid.** The Prism logo and app icon are now drawn from a real square pyramid, so the 2D logo and the 3D glass pyramid are the same object. It keeps the look of the original: the same faces, colours and angle.
- **The glass wears the logo.** At rest the 3D logo looks exactly like the icon; spin it and every face keeps its colour while the glass catches the light.

## 0.27.4 — the glass logo at the app icon's angle

### New
- **The logo at the icon's exact angle.** The glass pyramid now rests at exactly the angle of the Prism app icon: the same outline, the same edges and the same faces. Drag it to spin it; it glides back to the icon's pose.

## 0.27.3 — a true glass pyramid, a tidier update button

### New
- **A true glass pyramid.** The logo is a regular triangular pyramid: four equilateral glass faces, set at the angle of the original logo. Light still enters from the left and leaves as a spectrum as it turns.
- **A tidier update button.** When an update is ready, a small Restart button sits neatly between Settings and Downloads, in light and dark.

## 0.27.2 — a true glass prism

### New
- **A true prism.** The logo is now an equilateral triangular prism in glass: two equilateral triangles joined by three rectangular faces, set at the same angle as the original logo.
- **Light that splits like a real prism.** White light enters one face, bends through the glass and leaves the other face as a spectrum, following the prism as it turns. Click the logo to switch the light on or off.

## 0.27.1 — a live glass logo, smoother swipes, a calmer new tab

### New
- **A live glass logo.** The Blender-modelled Prism now renders live at full frame rate. Drag it to spin it all the way round; it keeps turning slowly on its own.
- **Light through the prism.** A white beam enters the glass and leaves as a spectrum, bending as the prism turns. Click the logo to switch the light on or off.
- **Swipe between pages, faster.** The arrow follows your fingers and the page changes the moment you let go. A quick flick is enough.
- **Swipe between spaces, like macOS.** The sidebar follows your fingers and springs back if you don't go far enough. Swipe left for the next space, right for the previous one.
- **A calmer new tab.** When every tab is closed, the logo sits in the middle with the wordmark below it, and your recently closed tabs wait at the bottom.

## 0.27.0 — a real glass logo, trackpad gestures, close all tabs

### New
- **A real glass logo.** The Prism logo is now a 3D glass object modelled and rendered in Blender, built on the exact corners of the original. Light refracts through it with a faint spectrum, and in the welcome guide it turns toward the pointer.
- **Swipe between pages.** Swipe left or right with two fingers to go back or forward. An arrow at the edge shows when the swipe will go through. Pages that scroll sideways keep their own swipe.
- **Swipe between spaces.** Swipe with two fingers on the sidebar to move to the next or previous space.
- **Close all tabs.** A new button beside Open Tabs closes every unpinned tab in the space. Undo or ⇧⌘T brings them back.
- **Pinch to zoom.** Pinch to zoom into a page, and double-tap with two fingers for smart zoom.
- **Look Up.** Right-click a selected word to look it up in the macOS dictionary.

Trackpad gestures follow macOS's "Swipe between pages" setting and can be turned off in Settings → Accessibility.

## 0.26.0 — glass logo, swipe transitions, update sequence, extension side panels

### New
- **A glass Prism logo.** The logo is now a 3D glass object: the same shape, with light refracting through it and splitting into a soft spectrum. In the welcome guide it turns gently and leans toward the pointer.
- **Swipe between steps.** Each step of the welcome guide swipes into place, and you can swipe with two fingers on the trackpad. Switching profiles swipes the sidebar too.
- **Smoother updates.** A quiet ring in the sidebar shows an update downloading, then a small Restart to Update button appears. After restarting, this window shows what changed.
- **Extension side panels.** Extensions with a side panel, such as Claude, open docked beside the page. Resize the panel by its edge; Prism remembers the width.
- **Settings, closer to macOS.** Small coloured icons, grouped sections and native-sized controls, with less clutter.
- **A tidier sidebar corner.** The window buttons line up with the toolbar, and the sidebar starts right below them.

## 0.25.2 — extension side panels, a tidier sidebar corner, macOS-style Settings

### New
- **Extension side panels.** Extensions that use Chrome's side panel (Claude, for example) now show up under the toolbar's Extensions button. Choosing one docks its panel to the right of the page, with the extension's name and a close button on top. Drag the panel's left edge to resize it; Prism remembers the width for each extension. A panel an extension opens for one tab stays with that tab, and a window-wide panel follows every tab.
- **Claude's extension works.** Its background worker used to stop at startup on Chrome features Prism doesn't have yet, so its toolbar icon did nothing. It now starts, and its panel opens next to the page. Its browser-control features (page automation through Chrome's debugger) aren't supported in Prism yet.
- **Extension options open in a tab**, as in Chrome, instead of a small separate window. In Settings → Extensions, extensions with a side panel get an **Open side panel** button.
- **Tidier top-left corner.** The window buttons now line up with the toolbar, and the space switcher and first sidebar rows sit right under them on the same left edge.
- **Settings closer to macOS System Settings, still minimal.** It has small coloured symbol tiles in the sidebar, a soft highlight on the selected section, and section names without capitals. Pages use grouped rounded sections with fine separators, labels on the left and controls on the right. Pop-up menus, buttons and switches are native-sized, the descriptions are smaller and grey, and the heavy borders, rings and oversized headings are gone.

## 0.25.1 — native-looking toolbar and sidebar, drag-to-reorder favorites, extension panels

### New
- **Native-looking toolbar and sidebar icons.** Toolbar buttons, favorites and the sidebar footer buttons are plain icons at rest, like macOS toolbars and sidebars; a soft rounded highlight fades in only when you hover, press or select them.
- **Drag favorites like on macOS.** Pick up a favorite and it lifts and follows the pointer while the others slide aside to show where it will land; let go and it settles into place. Press Esc to put it back. (To remove a favorite, use its right-click menu.)
- **Native-feeling motion.** Buttons press in quickly, dragged tabs and bookmarks lift with a soft shadow, resize and split lines light up, and switches and sliders glide. All of it is short and turns off with Reduce Motion.
- **Favorite icons stay visible.** One-colour site logos that disappear against the sidebar — a black logo in dark mode, a white one in light mode — are shown in the opposite tone. Colourful logos are never changed.
- **Extension panels from the toolbar.** The Extensions button shows only extensions that have their own panel, as icons. Choosing one opens its panel right under the button; it closes when you click away.

## 0.25.0 — liquid glass icons, native-feeling motion, readable favorites, extension panels

### New
- **Liquid glass icons.** Toolbar buttons, favorite tiles and the sidebar footer buttons are glass: translucent, blurred and saturated, with a soft top highlight, inner edge and shadow, tuned for light and dark. With Reduce Transparency they turn solid.
- **Native-feeling motion everywhere.** Buttons brighten and lift slightly on hover and press in quickly; dragged tabs, bookmarks and favorites lift with a soft shadow and the drop spot glows; resize and split lines light up; switches and sliders glide. All of it is short (120–240 ms) and turns off with Reduce Motion.
- **Favorite icons stay visible.** One-colour site logos that disappear against the sidebar — a black logo in dark mode, a white one in light mode — are shown in the opposite tone. Colourful logos and icons with their own background are never changed.
- **Extension panels from the toolbar.** The Extensions button now shows only extensions that have their own panel, as icons (names on hover). Choosing one opens its panel right under the button; it closes when you click away. Manage all extensions in Settings → Extensions.

## 0.24.1 — extension windows, aligned buttons, Extensions popover under its icon

### New in 0.24.1
- **Extensions can open their own windows.** Pop-out vaults, translators and sign-in helpers that use `chrome.windows.create` now get a real window at the size they ask for; the extension can find, focus and close it (but never Prism's main window). Web pages they open become Prism tabs.
- **Extensions popover opens under the Extensions icon** in the toolbar, right-aligned to it, and follows it when the window is resized.
- **Buttons aligned:** icon buttons in Extensions, Passwords, Downloads and History rows are exactly centered with equal size and spacing; the Add login button matches the search field.

### Sidebar
- **Organize tabs** button next to OPEN TABS sorts open tabs by site; an **Undo** toast puts them back.
- **Rename tabs in place:** double-click a tab (or choose Rename tab…), type, press Return; Esc cancels; an empty name goes back to the page title.
- **Richer tab menu:** rename, use page title, pin/unpin, duplicate, add to a folder, split, close, close other tabs, close tabs below — all translated.
- **Undo for removals:** closing several tabs, removing or deleting a folder, and removing a pinned bookmark can be undone. Folders can now also be deleted together with their bookmarks.

### Downloads
- The sidebar Downloads button shows a **progress ring** while files download and a **count of finished downloads** you haven't opened yet.
- Cleaner download rows with a file-type badge, size or progress ("45% · 1.2 MB / 2.6 MB"), and open, show in Finder, pause, resume, cancel and retry. Click a finished file to open it; **Clear finished** in the popover.

### Passwords
- **Add login** manually, and **copy username or password** from each row.
- Showing or copying a saved password asks for **Touch ID** (or a confirmation on Macs without it). Copied passwords leave the clipboard after a minute.
- Clearer list with site, account and actions; edit and add show what went wrong instead of failing silently.

### Extensions
- Each extension shows **its own icon**, version, state and description, with popup, options, reload and remove as quiet icon buttons; search appears when you have many.
- The Extensions toolbar popover is compact: name, state, popup and the switch.

### Also
- History and Site permissions use the same compact rows; permissions now read "Camera · Allowed" in your language instead of raw values.
- Menus for tabs, folders and bookmarks are translated into all six languages.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

Validation: 115 unit tests and the isolated smoke suite pass; every new flow was exercised in the test profile with test data (screenshots in the release notes).

## 0.24.0 — cleaner extensions, passwords, downloads and tab editing

### Sidebar
- **Organize tabs** button next to OPEN TABS sorts open tabs by site; an **Undo** toast puts them back.
- **Rename tabs in place:** double-click a tab (or choose Rename tab…), type, press Return; Esc cancels; an empty name goes back to the page title.
- **Richer tab menu:** rename, use page title, pin/unpin, duplicate, add to a folder, split, close, close other tabs, close tabs below — all translated.
- **Undo for removals:** closing several tabs, removing or deleting a folder, and removing a pinned bookmark can be undone. Folders can now also be deleted together with their bookmarks.

### Downloads
- The sidebar Downloads button shows a **progress ring** while files download and a **count of finished downloads** you haven't opened yet.
- Cleaner download rows with a file-type badge, size or progress ("45% · 1.2 MB / 2.6 MB"), and open, show in Finder, pause, resume, cancel and retry. Click a finished file to open it; **Clear finished** in the popover.

### Passwords
- **Add login** manually, and **copy username or password** from each row.
- Showing or copying a saved password asks for **Touch ID** (or a confirmation on Macs without it). Copied passwords leave the clipboard after a minute.
- Clearer list with site, account and actions; edit and add show what went wrong instead of failing silently.

### Extensions
- Each extension shows **its own icon**, version, state and description, with popup, options, reload and remove as quiet icon buttons; search appears when you have many.
- The Extensions toolbar popover is compact: name, state, popup and the switch.

### Also
- History and Site permissions use the same compact rows; permissions now read "Camera · Allowed" in your language instead of raw values.
- Menus for tabs, folders and bookmarks are translated into all six languages.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

Validation: 115 unit tests and the isolated smoke suite pass; every new flow was exercised in the test profile with test data (screenshots in the release notes).

## 0.23.0 — working copy buttons, censorship bypass, quick feedback

### Fixed
- **Copy buttons on websites work.** Pages can write to the clipboard after a click, as in Chrome. Reading the clipboard asks first and is remembered per site (Settings → Site permissions).
- **Instagram no longer crashes Prism.** Opening the Instagram app window crashed the whole browser; it now opens Instagram's mobile site normally.
- **Bypass censorship (formerly "Zapret") works on DNS-blocked sites.** Private now looks up sites over encrypted DNS (Cloudflare, Google) while the bypass runs, so sites blocked by DNS — as well as by packet inspection — open in Private. Verified on a site blocked by both on a Turkish ISP connection.

### New
- **Share** from websites opens the macOS share menu (title and link; not available in Private).
- **Pointer lock** for games and 3D viewers (press Esc to release).
- **Quick feedback:** Ctrl+Shift+C shows a "Link copied" sweep on the address bar; bookmarking, reloading, pinning, reopening a tab and zooming show a short confirmation. Reduce Motion keeps them still.
- **Page zoom** with ⌘+, ⌘− and ⌘0, and **Reload without cache** with ⌘⇧R.
- **Bigger Settings** on large or full-screen windows (up to 1100×800).

### Simplified Settings
Removed, with what they fall back to:
- Corner radius → 18 px.
- Background opacity → 36% (Window material still sets the look).
- Sidebar width slider → keeps your current width; drag the sidebar edge to resize, double-click to reset.
- Awake tab limit → Memory balance (Performance): 4 stays Low memory; No limit, 16 and 32 become Balanced (8).

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

Validation: 111 unit tests and the isolated smoke suite pass; web features tested on a local fixture page; release archive signature, size and SHA-256 are verified before and after upload.

## 0.22.0 — welcome guide, installer and GitHub updates

### What's new
- **A new welcome guide.** Seven short steps — Welcome, Look, Places, Logins, Default browser, Sidebar & tabs, Privacy — with a glass illustration for each, refined type and gentle motion that respects Reduce Motion. Light and dark, in English, Turkish, Spanish, Portuguese, French and Ukrainian.
- **A proper installer.** Prism now comes as a disk image with a drag-to-Applications window.
- **Updates from GitHub.** Prism checks this repository's releases in the background (about 20 seconds after launch, then every 6 hours, when Automatic updates is on), downloads new versions quietly and installs them on the next launch or with "Restart and install". Every update must carry Prism's release signature and match its exact size and SHA-256, or nothing is installed; a failed install rolls back.

Also in recent releases: a cleaner sidebar, a native "Open app?" prompt when a sign-in page returns you to the app that opened it, working popup sign-ins, and a refined Settings with search.

### Install notes
This beta is **ad-hoc signed and not notarized by Apple**. The first time you open it, macOS may say it can't verify the developer: right-click (or Control-click) Prism in Applications and choose **Open**, then **Open** again. Apple Silicon (arm64) only.

Validation: unit tests and the isolated smoke suite pass; release archive signature, size and SHA-256 are verified before and after upload.

## 0.21.9 — sidebar refinement and app sign-in handoff

- **Sidebar:** the profile row (icon and name) is gone from the sidebar footer, leaving Settings and Downloads; the profile remains in Settings → Personal → Profile. The thin line on the sidebar's right edge is removed in both themes; resizing by dragging that edge still works.
- **Back to the app after signing in:** when a sign-in page sends you back to the app that opened it (an app link such as `myapp://…`), Prism now asks "Open “App”?" in a native macOS dialog instead of silently ignoring it. Redirects, scripts, auto-refresh, links and popups are all covered. "Always allow <site> to open these links" remembers the choice per site and app (never in Private). Links that could run scripts, reach local files, browser internals or network shares are never passed to macOS, and links with no installed app are ignored.
- **Popup sign-ins:** "Sign in with…" popups open as real, sandboxed popup windows that keep their connection to the opening page, so they can report back and close. Normal new-tab links still open as tabs.

Validation: 102 unit tests (5 new for app-link rules) and the isolated smoke suite pass; `lint:ui` shows no new findings. End-to-end on a local test page with `mailto:` (dialog simulated, no app opened): the prompt appears for redirect, script, meta refresh, link and popup; nothing happens for `file:` or an uninstalled app; "Always allow" suppresses the next prompt; a popup sign-in posts back to its opener and closes. Not yet tried with a real third-party app login. Screenshots and results: the release notes. This local beta is ad-hoc signed and delivered through the private local update feed; public publishing and notarization are not configured.

## 0.21.8 — Settings fixes

First release validated in the running app. It fixes the 0.21.7 Settings refinement after its first real-GUI pass.

- **Settings search** now switches into a results view, hides other sections while searching, shows clean setting labels with their section name, ranks label matches first, and opens the chosen setting in view.
- **Narrow windows:** the minimum window width is now 760 px, so the compact Settings layout with a horizontal section strip is reachable; the open section stays visible in that strip.
- **Translations:** the remaining Settings navigation labels and the Passwords and Accessibility pages are translated into Turkish, Spanish, Portuguese, French and Ukrainian, including saved-login counts and vault status.
- **Accessibility:** group headings and spacing meet Prism's UI policy, and the "Open Design Studio" link reaches 4.5:1 contrast in the light theme.
- **Stability:** fixed a startup script-order error (`uiMotion is not defined`) in the browser window.
- **Tests:** the smoke suite finds Settings in its own view again, and `lint:ui` now audits the Settings view.

Validation: 97 unit tests pass and the isolated smoke suite passes. `lint:ui` runs; its remaining findings predate this release (fractional font sizes in older panes, the transparent root background used for glass, the icon-only close button, and placeholder contrast the tool cannot measure). Screenshots and the GUI report are in the release notes. This local beta is ad-hoc signed and delivered through the private local update feed; public update publishing and notarization are not configured.

## 0.21.7 — refined Settings

Settings now groups preferences into Personal, Browsing, Privacy & security, Intelligence and System. Search finds matching controls across sections and opens the relevant pane at that preference. The navigation remains available in narrow windows, and the new labels use Prism's six supported interface languages. The footer reads the current Prism version from app state.

Validation: 97 unit tests pass; JavaScript syntax and HTML/CSS structure checks pass. GUI rendering could not be captured because Electron exits with status 134 in this environment. This local beta is ad-hoc signed; public update publishing is not configured.

## 0.21.6 — Instagram Mobile

Open Instagram in a dedicated, phone-sized Prism window from **View → Instagram Mobile App**, or from an Instagram favorite's context menu. The window requests Instagram's mobile site using the same Chromium engine already bundled with Prism, with mobile device metrics sized for a 430 × 844 CSS-pixel viewport.

- Personal and Work use Prism's existing shared Chromium session, so an Instagram sign-in already stored in Prism is available.
- Private uses its temporary isolated session. The mobile window closes when leaving Private or ending the session.
- Instagram links stay in the mobile window; links to other sites open in tabs in the corresponding Prism space.
- The standard desktop Instagram tab and favorite are unchanged.
- This is Instagram's mobile website in Chromium, not Instagram's native iOS/Android app. Site behavior and available features remain controlled by Instagram and may change.

Validation: URL allowlist, user-agent, viewport emulation, shared-session wiring, private-session separation, and external-link routing are covered by focused unit tests. GUI network behavior still depends on Instagram's current site and account state.

## 0.21.5 — local account preview

Profile settings now include a development account manager backed by the separate Prism account service. This is not public cloud sync. No mailbox ownership is verified until a real email delivery adapter is deployed.

- Expiring single-use development sign-in, Keychain-encrypted desktop session.
- Explicit name/theme upload and profile download; revision conflicts prevent silent overwrites.
- Account creation timestamp, device list, session revocation, sign-out, JSON export and account deletion.
- No server process inside Prism, no background account polling. Existing local profile works offline.
- No passwords, cards, history, cookies, AI keys or private browsing transferred.
- Existing logo retained unchanged.

Backend: workspace `services/prism-account`, zero npm dependencies, Node 24+, SQLite, loopback only. Start its `.command` launcher separately. Local preview is in Settings → Profile. The separate server source ZIP includes API documentation and the hosting/iOS roadmap.

Validation: two backend integration scenarios cover account isolation, persistence, expiration, rate limits, single-use codes, profile conflicts and revocation/deletion. Desktop GUI fixture passes sign-in, macOS encrypted token persistence, explicit profile upload/download, device list and sign-out. Panel screenshot reviewed. No public email, internet account or iPhone sync is claimed.

## 0.21.4 — personal profile card

Redesigned the local profile card with the user's current faceted Prism logo, a compact wordmark, a quiet theme-colored surface, restrained diagonal detail, name/email hierarchy and a separate creation-date footer. Supports light/dark palettes and long names/email addresses. Uses a small static image and CSS; no animation loop, extra renderer or AI-generated identity.

Creation dates are now recorded on the first save of a new local profile and retained on edits. Existing profiles that lack a date remain explicitly undated (Not recorded), rather than assigning a false account creation date. This is a local Prism profile, not a verified cloud account. The existing name, email and theme remain editable; the date cannot be overwritten through the profile-save action.

Five focused core tests passed. Disposable-profile Electron validation covered the original logo loading, automatic first-save timestamp, date preservation against an attempted overwrite, light/dark rendering, and long-text fit. Both theme screenshots were reviewed. Fixture screenshots use an example email and do not modify the actual user profile.

Published through the authenticated local beta feed. Quit and reopen the installed Prism to install this update automatically.

## 0.21.2 — local automatic beta updates

Prism checks the local release feed before opening a browser window when Automatic updates is enabled. A newer authenticated build is staged beside /Applications/Prism.app, verified, installed after the old process exits, and reopened. Profiles, cookies and the vault are not copied, deleted or migrated by the updater. A missing or invalid feed leaves the current browser available. Settings → Updates can check manually and request restart/install.

This is a single-Mac local beta channel, not internet distribution. Feed: ~/Library/Application Support/Prism Local Updates. The app pins an Ed25519 public key; the private publishing key is outside the source project and excluded from source archives. Manifests identify an Apple Silicon Prism version and archive hash/size. Installation checks the archive hash again after staging, validates codesign and bundle identity/version, and only replaces Prism.app in /Applications or ~/Applications. A failed swap/launch restores the old bundle. The previous app is retained in the transaction folder until the new app reaches its ready window. If a newly launched process crashes before readiness, the retained Previous.app is available for manual recovery; crash rollback is not automatic.

Local signing is ad-hoc plus the pinned release signature, not Apple Developer ID/notarization. Internet update publishing remains unconfigured. Keep the local feed accessible on this Mac. Removing a release file prevents that update from installing but does not remove browsing data.

### Build workflow

Use `npm run release:local` (or the bundled Node runtime on scripts/release-local.cjs) for every finished desktop beta. It packages, ad-hoc signs, verifies, creates the ZIP, and publishes the authenticated local manifest last. Run scripts/package-source.cjs for the companion source ZIP. Do not regenerate the private signing key: existing installations trust its corresponding public key. Never package or publish the private key.

### Validation

Eight local/remote updater tests passed: signed manifest identity/version/path validation, tampering, absent and malformed feeds, failed-version suppression, successful bundle replacement, launch-failure rollback, and the existing remote updater gates. Swap tests use disposable directories and a stub launcher; startup installation on the actual Applications bundle is validated separately when deploying the initial update-enabled release.

### Deployment result

A signed updater-enabled 0.21.1 bootstrap was installed once in /Applications. On launch, it consumed the authenticated local 0.21.2 feed, staged and verified the bundle, exited, replaced itself, and reopened 0.21.2. The real UI shows Automatic updates on and Local beta feed · Prism is up to date. Favorites/folders remain present; The first deployment exposed an Electron app.asar cleanup issue; 0.21.3 uses original-fs to remove the previous bundle. The replacement app passed codesign verification.

### 0.21.3 verified follow-up

The installed 0.21.2 updated itself to 0.21.3 on the next launch. The new UI showed 0.21.3, code signature verification passed, and healthy-start cleanup removed the previous bundle and transaction marker. The incomplete temporary backup from the first test was removed separately.

## 0.21.1 — everyday polish and measured panel release

- Labeled Split toolbar button, visible divider, and Layout / Swap / Done controls. Narrow windows retain compact icon controls. Pointer-capture loss ends dragging cleanly.
- Smaller profile card with clearer typography and borders in light/dark themes. Repeated browser state events no longer rewrite an unchanged profile preview. iCloud status reflects the chosen future route and current provisioning limitation.
- Selected text → right-click → Translate Selected Text, or View → Translate selected text. Opens selected context locally; choose a language and Send, then preview and Copy the result. No whole-page replacement. OpenAI API key required; ChatGPT sign-in is separate. Private and editable fields remain excluded.
- Closed utility panels now release their renderer after three seconds instead of fifteen. Rapid reopening can still reuse the panel. No new background model, process or indexing.

### Validation

Focused isolated Electron checks verified real pointer dragging, both split orientations, pane focus, PiP and its sleep protection, fullscreen entry/exit, favorite identity and saved URL, typed address opening a new tab, MRU close and reopen, two-account password suggestions, account selection/fill, masked card choices and navigation dismissal. All credentials were synthetic local HTTPS fixtures. Light/dark profile captures were reviewed.

Selected-text entry → Turkish output → preview → Copy → Clear passed end-to-end with a simulated provider. No live API request or real browsing content was used. Five page-menu unit tests and six assistant unit tests cover editable/password exclusions, explicit Send, Private, cancellation, changed navigation, missing key and bad responses. The test harness was corrected to observe fullscreen state rather than awaiting its unresolved JavaScript promise. Shutdown-only untrusted-sender logs appeared after one test's completed assertions; application IPC sender checks remain intact.

These checks use local fixtures, not a compatibility claim for every video site or login flow. Live translation quality and paid API access remain unverified.

### Memory

See reports/MEMORY-0.21.1.md and the before/after JSON files. The measured improvement is earlier release of a panel renderer, not lower per-tab Chromium memory. Keep existing dirty-form, active media, capture, split and PiP protections. Idle and media totals vary between runs; no battery or Arc comparison is claimed.

Apple Silicon; ad-hoc signed. Latest user icon unchanged. The installed browser and existing data are not replaced by packaging. Update publishing is not configured.

## 0.21 — page assistance

Open View → Page assistant (also in Settings). Choose a page excerpt or selected text, an action and output language. Preview context before pressing Send to OpenAI. Selected-text translation supports English, Turkish, Spanish, Portuguese, French and Ukrainian. Results are plain selectable text with Copy; the source page is unchanged.

Uses the existing encrypted OpenAI API key and gpt-4.1-mini through the Responses API. API access is separate from ChatGPT sign-in. Download naming retains its independently selected provider. Page assistance currently supports OpenAI only. Gemini, on-device summaries, streaming and reversible full-page translation are deferred.

Only a bounded preview (12,000 characters) and site origin are sent, after explicit Send. Query strings, cookies, form controls, editable areas, hidden content, frames and shadow DOM are excluded from extraction. Visible article text can still contain personal information: the preview shows the exact text to review. Private is disabled. Navigation, tab/space changes, panel dismissal and Cancel invalidate context; requests have a 30-second timeout and bounded responses. No browser tools, automatic actions, new background renderer, indexing or persisted assistant history are added. The existing panel is released after its idle timeout. No measured RAM reduction is claimed.

### Validation

Six assistant unit tests plus seven existing AI/wallet tests passed. They cover no request before Send, bounded context/origin, missing key, invalid language/action, malformed/incomplete/oversized response, cancellation, stale navigation, Private exclusion and existing naming behavior. Focused disposable-profile Electron checks passed for real DOM filtering, exact selection, preview/clear UI and Private rejection; the panel screenshot was reviewed. No real API key or cloud response was used, so provider account access and live result quality remain unverified.

Current user icon retained. Apple Silicon package is ad-hoc signed; update publishing remains unconfigured. The installed application is not replaced automatically.

API reference used: https://developers.openai.com/api/docs/guides/text

## 0.20 — two pages, one workspace

### Features

- **Copy page link:** Ctrl+Shift+C, also Command+Shift+C when the browser UI or page has focus. Copies the active pane's URL, not the page body. Available in Edit too.
- **Two-tab split:** toolbar layout button or View → Tabs & layout. Pick another open page and choose Side by side (vertical divider) or Top & bottom (horizontal divider). Drag the divider between 25–75%, use arrow keys in 5% steps, or double-click/Home to reset. Pane-title buttons focus either page; swap or end split from the strip. Selecting another page replaces the focused pane. Closing either pane, opening a blank tab or changing spaces ends split. Split is temporary rather than restored across restart.
- **Tidy and rename:** arrange unpinned open tabs by site, with one-level Undo. No tabs are closed. Right-click a tab to pin, rename, restore its original page title or pair with the current page. Custom names persist through navigation and normal session restore. Favorites keep their bookmark labels.
- **Inspect:** right-click → Inspect Element, View → Inspect page, or Command+Option+I. Chromium's managed in-page dock provides HTML, CSS, Console, Network and its own dock/resize controls. It opens on demand and closes when switching tabs. The custom DevTools host was rejected after validation; the supported managed dock is used.
- **Picture-in-picture:** View menu, page tools, or right-click a video. Uses the original native video player, without a duplicate browser tab or replaying the stream. Active PiP is protected from tab sleeping. A site's player/permissions can disallow PiP; the browser reports this instead of bypassing restrictions. Embedded players can be targeted from their video context menu.
- **Local profile:** a compact business-card design with name, email and favorite theme. Saving applies the theme. Connections open existing Gmail/ChatGPT/Gemini web sessions or the local password/API settings; they do not authenticate or link accounts themselves. No extra background pages are created. Profile data is hidden in Private. Mobile sync is deferred by explicit user choice.
- Whole-page and selected-text translation added to AI-ROADMAP.md, with reversible page changes and explicit provider/context choices planned.

### Validation

17 focused unit tests passed: split geometry, tidy preservation, profile validation, custom-name persistence, session recovery, page menus, tab selection and memory protections. Disposable-profile Electron checks passed: both split orientations, ratio changes, pane focus, two existing views reused, visible split sleep protection, title retention, URL copy, profile UI, real managed DevTools, native video PiP from a local generated stream, PiP source sleep protection, closing a partner, and Private-space exclusions. A separate inspector check confirmed a single BrowserWindow. Workspace/profile screenshots were reviewed. Some repeated screenshot captures failed with transient compositor errors; functional checks then completed without redundant captures.

No real email account, password vault, cloud AI service or mobile device was used in these tests. No numeric RAM reduction claim is made: PiP avoids a second page, while the original media page must stay awake. Inspector memory is allocated only on demand.

Package retains the icon resource copied from the user's latest build. Ad-hoc signed for Apple Silicon. Automatic update publishing remains unconfigured; the installed application is not replaced by this package.

## 0.19

- Hidden sidebar now leaves matching 6px page gutters and aligns traffic lights with the toolbar. Fullscreen remains edge to edge.
- Closing the active tab returns to the most recently selected surviving tab in the current space, including favorites.
- Memory pressure release prioritizes heavier eligible renderer processes, discounts shared processes, and rechecks pressure between releases. Automatic batches allow four tabs; manual cleanup allows eight. Existing active/form/media/capture protections remain.
- Preserve the icon resource from the user's latest outputs/Prism.app. No logo redesign.
- AI-ROADMAP.md proposes GPT, Gemini and Siri features; these are not newly enabled.

Validation: seven focused unit tests passed. Focused Electron checks passed for favorite-tab return, collapsed page bounds, traffic-light position and sidebar restoration. The renderer screenshot excludes native child views, so it is not a full composited-window visual check. RAM reduction varies with workload; no measured percentage is claimed. Automatic update publishing remains unconfigured.

## 0.18 — beta

### Live backgrounds and compact panels

Settings, Extensions and Downloads now use one reusable in-browser WebContentsView above the website. The page underneath remains visible and running; no full-page blackout or screenshot capture is needed. These are not additional macOS windows. The surface is created on demand, hidden on close, and destroyed after 15 seconds idle. Cold opening includes creating that surface; this build does not claim zero startup cost.

The download popup is 344 px wide, shows the five newest download records, and uses compact Open/Reveal icons with accessible labels. The full Downloads settings section retains the longer history and manual AI rename action.

### Automatic download naming

New completed Personal/Work downloads automatically use the selected AI naming provider. The default is on-device Apple Intelligence. Settings → AI & assistants can disable automatic naming. Old downloads are never bulk-renamed. Private downloads are excluded. Naming requests are serialized, retain the file extension and never overwrite a target file. If the provider is unavailable or naming fails, the original file/name remains. Cloud naming requires your configured OpenAI API key and may incur API charges; its existing metadata-only request policy is unchanged.

### Gmail favorites

In Appearance, choose **Add Gmail to Favorites**, open Gmail in Prism and sign in. Hover its favorite for a compact preview of the first three displayed inbox threads, including sender, subject and a short snippet. This uses your existing browser sign-in, with no OAuth setup, second Gmail renderer or background polling.

Gmail must be awake and showing the inbox. Sleeping, signed-out, empty, or other-folder tabs offer Open inbox instead. The preview follows Gmail's displayed ordering, including the current inbox category; it is not an independent server-wide latest-message query. Preview data is cleared on close, is never persisted, and is unavailable in Private. This is a DOM adapter and may need updates if Gmail changes its markup. Validation used a local Gmail-shaped fixture; your real mailbox was not read.

### Memory and cache

Lean memory mode is enabled by default. It caps Chromium's disposable HTTP disk cache at 128 MiB on startup and Prism's preview/image cache at 2 MiB. Under estimated app memory pressure it sleeps up to two eligible idle tabs per existing 30-second sweep. Existing media, unsaved-form, capture, active-tab and protected-tab checks still apply.

Performance settings also offer **Release idle memory & disposable cache**, which releases up to four eligible idle pages and clears the normal session's HTTP cache. It does not delete cookies, passwords, local storage, IndexedDB or service workers. Disk-cache limits control disk storage; they are not a promise of equivalent RAM savings. Working-set estimates may include shared pages. There is no recurring cache purge or forced garbage-collection loop, which can cause reload cost and stutter.

### Validation and delivery

74 unit checks are covered (the changed panel lifecycle test was updated and rerun). A focused GUI pass verifies live background updates, no additional native windows, five compact downloads, surface reuse/cleanup, real on-device automatic naming, the three-row Gmail fixture and active-page preservation during memory cleanup. The download and Gmail panels were visually reviewed. Earlier full smoke scripts still assume panels live in the main renderer and need migration before using them as a release gate; this build used the targeted suite requested by the user.

Apple Silicon ad-hoc-signed beta ZIP. Installed copies are not overwritten. Updater publishing remains disabled pending the separately deferred signing/feed setup.

### References

[Electron WebContentsView](https://www.electronjs.org/docs/latest/api/web-contents-view) and [session cache APIs](https://www.electronjs.org/docs/latest/api/session) define the view and cache controls used here. [Electron's resource-cache guidance](https://www.electronjs.org/docs/latest/api/web-frame#webframeclearcache) cautions that repeated blind cache clearing can slow pages down.

## 0.17 — beta

This build restores the current user-supplied triangular Prism logo with a white app-icon background, removes the synchronous page screenshot from Settings opening, and uses the standard split-panel sidebar symbol. Panels use restrained borders, shadows and short motion. A tab-state race that could close a newly opened panel is fixed.

### Downloads and AI

Download start/completion notices animate softly and respect reduced motion. Completed downloads offer **Rename with AI**, followed by an editable suggestion and explicit Apply. The original extension is retained; existing files cannot be overwritten.

Apple Intelligence is the default on-device provider, started only for a request. An optional OpenAI provider accepts your own API key, encrypted locally. Only filename, MIME type and source page title are sent on request; file contents, full URLs and credentials are excluded. AI is disabled in Private. Settings → AI & assistants also opens ChatGPT and explains Siri Shortcuts actions. See [AI setup](AI-INTEGRATION.md).

### Passwords and payment cards

Click a supported login field to choose a saved account without the toolbar button. Suggestions belong to the browser, appear only after user interaction, require an exact HTTPS origin, and disappear on navigation. Selecting an account fills without submitting. Payment cards can be added in Passwords settings; storage is encrypted, the picker exposes only masked numbers, and CVC is never saved or filled. The dropdown is created on demand and released after 15 seconds hidden.

This uses Prism's imported/saved credentials, not direct access to the Apple Passwords vault. Automatic suggestions currently cover main-frame input fields; embedded cross-origin forms, shadow DOM and select-based card expiry fields need further compatibility work.

### Folders and fullscreen

Right-click a pinned folder to rename it, add a bookmark, or remove the folder while keeping its saved pages. F2 on a focused folder opens Rename. Renaming preserves nested imported folder paths, addresses and order; name collisions are rejected. Bookmark edits retain their position, and moving a favorite into a folder now removes it from the Favorites grid.

Video fullscreen is allowed for the visible web page in normal and Private spaces. The website occupies the entire window with no rounded inset while fullscreen; Escape, navigation and switching tabs restore the browser layout. Chromium's gesture and embedded-frame fullscreen policy still apply.

### Validation and remaining setup

- 71 unit tests pass, including folder preservation/collisions, masked card storage and AI filename safety.
- Full browser smoke suite, credentials regression and navigation/context-menu regression pass.
- Focused GUI: account selection, card filling without CVC, encrypted storage, settings opening with no page capture or extra native window, download activity and real Apple Intelligence rename pass. Five Settings openings measured 1–12 ms to return; this is a local timing measurement, not a universal frame-rate claim.
- Real playing-video fixture passes fullscreen sizing, Escape, tab switching and navigation. Folder editing was exercised through the actual UI.
- OpenAI requests are mocked in tests; no API key or paid request was used. Siri voice invocation requires the user's Shortcut setup and was not voice-tested.
- Auto-update publishing remains disabled as requested; signing/notarization and hosted feed configuration are still pending. The ZIP contains an ad-hoc signed Apple Silicon beta. Installed copies are not automatically replaced.
- On-device naming requires macOS 26+, a supported Apple Intelligence Mac and downloaded/enabled models. General web compatibility and complete localization of detailed help remain ongoing beta work.

## 0.16 — beta

- White app-icon background, generated from the existing geometric artwork; smaller ICNS asset.
- Sidebar labels are not selectable; editable fields remain selectable. Dragging a tab by its main button now works, and dropping into the pinned group pins it. Existing bookmark/folder dragging is retained.
- Favorites reflow into more columns as the sidebar grows, with a visible border in both themes.
- English, Turkish, Spanish, Portuguese and French plus Ukrainian interface choices in Appearance and the welcome guide. Common navigation, settings controls, update status and welcome steps switch immediately. Website titles, bookmarks, account names and filenames are preserved. Technical diagnostics and some detailed help remain in English in this beta; this is not a claim of complete localization.
- Prism → Check for Updates… and an Updates settings pane. Publishing is deliberately disabled. There is no update request, download or installer activity until a feed and stable Developer ID signing are configured. Automatic checks will run once after launch and every six hours when configured and enabled; installation requires an explicit restart and existing unsaved-input/download checks.

### Validation

61 unit tests pass, including locale settings and mocked updater lifecycle, unsigned/unconfigured fail-closed behavior, duplicate-check suppression and retry.
Real Electron GUI tests pass for language switching, unchanged user names, favorite borders/reflow and pinned drag/drop. Full local-fixture smoke suite passes. Context-menu, favorite-navigation, extension-panel and default-browser-onboarding regressions also pass. Light and dark screenshots were inspected.

### Release limitations

This build remains locally ad-hoc signed and is manually installed. Automatic download/signature/install behavior cannot be validated end to end until a signed, notarized release and real beta feed exist. No public update server was configured or contacted. See UPDATE-PUBLISHING.md for the release procedure.

## 0.15.3

Settings and compact utility panels now render inside the existing browser shell, with short open/close animations and reduced-motion support. No utility BrowserWindow or extra renderer is created. While a panel is open, a bounded, one-time page capture preserves the visible background; the actual site continues running but is not interactive until the panel closes. The capture is released on close. Panels close when the active tab changes. Keyboard focus is contained within panel controls and restored to the originating toolbar button.

The toolbar is 44 points high, its controls 28 points, its icons consistently 16 points, and the address field 30 points high. Removed the browser-action strip between keep-awake and Extensions. Sidebar favorite icons are 19 points; home favorite tiles are smaller. History, Site permissions and Ads & trackers have matching symbols.

Extensions opens a compact toggle panel with a Manage extensions in Settings link. Full extension removal/options/reload/popup controls remain in Settings. Pending toggle buttons disable until the action completes. Downloads retains both its compact panel and the full Settings section.

Validation: 55 unit tests pass. Focused live-Electron GUI checks passed for in-browser panels, extension toggles, page-snapshot cleanup, favorite navigation, reduced motion and onboarding. The full GUI smoke suite passed for extensions, downloads, password filling, native glass, tab sleep/wake, Private isolation and setup. Captured quick-extension layout was visually inspected. The search test was updated to wait for panel-close animation before entering a query; no production change was needed during this validation pass. Tests used isolated temporary profiles. Real default-browser settings and the installed app were not changed.

## 0.15.2

The welcome guide now includes an optional default-browser step, with a Make Prism default action, verified HTTP/HTTPS status, and a System Settings fallback. Development/test runs cannot register the Electron development executable. Packaged Prism declares its web schemes and accepts HTTP(S) links from other apps, including bounded queuing during startup. External links open in Personal rather than inheriting a Private session. No default setting is changed automatically.

Favorites, pinned tabs and bookmark rearrangements use short transform/opacity transitions. Drag sources gently fade and shrink; drop targets use a fine highlight. Structural animations are only computed when tab/bookmark order or grouping changes, limited to visible items, and released when finished. Both macOS Reduce Motion and Prism Reduce Motion suppress animations; there is no continuous animation timer.

Includes the 0.15.1 separate Settings/Downloads windows and favorite address-bar behavior. Fixed initial loading of dynamically added Settings panes. The focused live-Electron regression check now passes for these features, onboarding, animation cleanup and reduced motion. 55 unit tests pass. System default changes were mocked/disabled in tests; the actual macOS confirmation flow has not been exercised to avoid changing the user's choice.

Full live-Electron smoke suite passed, including the six-step welcome guide, extensions, downloads, password filling, sleeping/waking and Private isolation.

## 0.15.1

Restores favorite identity during website links, redirects and form submissions. Only submitting a different address through the address bar opens a normal tab, preserving the favorite tab and bookmark URL. Submitting the same address reloads the favorite.

Settings, Extensions, History and other preference panes now use a reusable nonmodal Prism window. The sidebar Downloads shortcut opens a separate compact window, while the full Downloads pane remains in Settings. Windows are created lazily and destroyed on close. Their IPC is restricted to registered local window main frames. Website views remain visible behind these windows.

Website views have native 10-point rounded corners, with a thinner 6-point right/bottom surround. The address bar has a finer border and is slightly shorter. The keep-awake toolbar control now provides feedback and is disabled on empty tabs; Extensions opens its own Settings window.

Validation: 53 unit tests passed. Prior GUI inspection confirmed the new windows rendered; the focused test found a focus/suggestion overlay issue on returning to the main window. The source now blurs/dismisses suggestions before opening windows. Final focused and full GUI tests could not launch in the current sandbox (Electron exited 134), so that correction and final visual behavior still need a GUI test. This is not a fully GUI-verified release.

Delivery: preview package only. The installed /Applications/Prism.app was not replaced by this release because final GUI validation remains blocked.

## 0.15

Native page context menus now provide image copy/save/search, link actions, text search, editing, spelling suggestions, navigation and extension actions. Menus are constructed only on right click. Private uses its own tab space and download session; password selections are never offered to web search. Image URL search explicitly sends the selected public image URL to Google when chosen.

Favorites retain their saved URL. Same-site navigation includes subdomains; unrelated registrable domains (including separate private-suffix tenants such as github.io) detach the live page into a normal tab and leave a sleeping favorite at its saved URL. This preserves redirects and POST bodies without creating another live renderer. Legacy offsite favorite associations are repaired when reopened.

Fixed a destroyed-view race during tab navigation/closing. Set an explicit shell body height for predictable layout measurements. Production packaging omits development dependencies, source maps, TypeScript declarations, iconset sources and redundant raw filter lists. ASAR packs app resources; the installed bundle uses filesystem compression. No Chromium components or user profile data are removed.

### Lintapple

Installed lintapple 0.1.19 as an exact development dependency from npm. Run `pnpm lint:ui` to inspect the real Electron shell in an isolated temporary profile, reusing the installed Electron runtime without downloading another Chromium browser. Policy: `ui-policy.json`. Report: the release notes. Checks appearance, design and downloads at 800×560 and 1240×820, with the default light theme. This is a design baseline, not a clean bill of health: 463 findings remain, including repeated fractional font-size policy mismatches, spacing, tooltips, contrast and state/label checks. Transparent native glass also triggers root-background findings. Findings are not suppressed. Dark/custom themes and keyboard interaction paths remain to be audited. Lintapple and Playwright are not shipped in the app.

### Validation

52 unit tests passed. Local real-Electron context-menu/navigation checks passed: image clipboard, image address, selected text menu, same-site favorite reuse, offsite click/typed URL/redirect handling, POST-body preservation and no extra live renderer when leaving a favorite. Full smoke checks passed for extensions, downloads, encrypted password flow, native glass, sleeping/waking and Private isolation/helper lifecycle. No public Private/STUN probe was run. This release prevents extra renderer creation in the tested flow; it does not claim a measured overall RAM reduction.

Web image URL actions require HTTP(S); blob/data images support bitmap copying when available. UI lint findings remain follow-up work.

### Installed artifact

Installed /Applications/Prism.app is 302,388 KiB allocated (295.3 MiB), versus 309,960 KiB before (302.7 MiB). Signed bundle and ZIP integrity verified; packaged-ASAR navigation/menu checks pass. The ZIP is approximately 125 MiB. Existing running bundle retained temporarily at the path in reports/install-0.15.json because desktop UI control timed out. Quit and reopen Prism to activate 0.15; clean the prior bundle only after its old process exits.

## 0.14 — built-in blocking

Enabled by default in Personal, Work and Private. EasyList and EasyPrivacy run in one shared Ghostery filtering engine in the browser process. No ad-block extension process, per-tab rule copies, request log, recurring update requests or DOM MutationObserver. Compiled rules occupy 4,172,729 bytes. Request counters are bounded and disappear when a tab renderer closes. Engine matching caches are disabled.

Use the shield beside the address bar or Settings → Ads & trackers. Pause an exact hostname, or disable protection globally. Normal exceptions persist; Private exceptions stay in memory and are cleared on End Private. Changes affect new requests immediately; reload for cosmetic changes/already loaded resources. Changing settings does not discard unsaved forms. The global switch applies to all spaces.

Private request filtering composes with the existing Zapret guard. Pausing protection cannot bypass stopped or failed Private networking. Extension onHeadersReceived hooks remain intact.

Network filtering includes ad/tracker requests, third-party conditions and list exceptions. Host-specific and base CSS hiding are applied to the main document. No scriptlet injection, extended selectors, DOM-dependent cosmetic rules, subframe CSS, HTML rewriting or guaranteed video-ad removal. This is useful protection, not universal blocking or anonymity. Rules are bundled offline with this build and currently updated with app releases, not automatically. Refresh both official source lists and run scripts/build-blocker.cjs before a future release.

Validation: 48 unit tests pass, including standard list matches, rule exceptions, Private exception isolation and fail-closed behavior. A real Electron/local HTTP test confirms blocked scripts never reach the server, ordinary scripts load, cosmetic hiding works, and site pause/re-enable works. The complete local browser smoke suite passes, including extensions, downloads, tab suspension, password filling and Private lifecycle.

Measured in a single isolated run: deserializing the shared engine took 17.5 ms, approximately 3.0 MiB heap / 8.2 MiB RSS delta (after module loading). A synthetic page with a deliberately 64 MiB advertising script used 91.5 MiB renderer working set with protection, versus 158.0 MiB paused. This demonstrates avoided allocation; it does not predict real-site savings or compare Prism with Arc. Re-enabling after loading the ad did not immediately reclaim all memory (150.9 MiB). See reports/blocker-0.14.json. No claim of measured battery savings.

The separate public-site/STUN Private test remains unrun, pending the earlier explicit approval request. This release does not change that status. Distribution remains Apple-silicon-only and ad-hoc signed, without Apple notarization.

## 0.13 — reliability and measured memory controls

### Changes

- Favorite thumbnails recover from a missing macOS compositor surface using one bounded redraw/retry on the visible page. Background rendering is not permanently enabled. Captures are discarded after navigation, replacement, clearing the cache or switching away; concurrent requests share their work. Selecting a favorite or switching to cards retries a missing preview.
- Performance settings now offer Low memory (four awake tabs, two-minute idle sleep) and Balanced (eight / five minutes), plus on-demand process memory and CPU estimates. Background, closed-panel and occluded-window polling pauses. Protections for active tabs, media, edited forms, frames and explicit keep-awake tabs remain.
- Connected Electron's passkey account-selection event to a user-confirmed native choice. Only a matching active main-frame request may complete; navigation, another tab or Private cancels it. No Touch ID entitlements or Apple Passwords/iCloud sync are added.

### Verification

- 44 unit tests pass.
- Strict Electron browser regressions include favorite screenshot capture again, with no capture skip option. They also cover memory presets/resource rendering, downloads, local extension content scripts and tab APIs, password safeguards, onboarding and Private helper lifecycle.
- Synthetic media devices verified camera/microphone request, allow, reset and block. Notification permission and simulated geolocation succeeded. Virtual passkey registration and sign-in succeeded after the account-selection fix. Physical devices, Touch ID, iCloud passkeys and real conferencing services remain unverified.
- A separate-process recovery test kills only a disposable test app with SIGKILL, reopens its profile, validates back history/scroll/lazy tabs and Private exclusion, then corrupts the primary file and verifies backup recovery.
- See [performance measurements](reports/PERFORMANCE-0.13.md) for local and public-page observations. No Arc superiority, per-page Chromium reduction or battery-life claim is made.

### Pending validation

Automatic approval review blocked the new Private requests to example.com/wikipedia.org and Google STUN probe because they could expose public IP/network metadata to those services. Explicit user approval has been requested; that test has not run. Existing local tests establish helper startup/reuse/failure blocking and cookie isolation, not public-site access, DNS safety or comprehensive WebRTC leak protection. The test is preserved as `test/private-public-flow.cjs` for an approved run.

Broader real extension compatibility, physical hardware, DNS routing, matched Arc benchmarking, Developer ID signing/notarization and automatic updates remain future work. This Apple silicon preview is locally ad-hoc signed.

### Reference material

Electron documents the [capture API](https://www.electronjs.org/docs/latest/api/web-contents/#contentscapturepagerect-opts) and [passkey account-selection callback](https://www.electronjs.org/docs/latest/api/session#event-select-webauthn-account). The automated authenticator uses the [Chrome DevTools WebAuthn domain](https://chromedevtools.github.io/devtools-protocol/tot/WebAuthn/). Implementations and tests were checked against the installed Electron 44.5.1 API declarations.

## 0.12 — credentials and session recovery

### Passwords

Settings → Passwords now has a searchable login manager. Edit a website, username or password; leave the password field empty to preserve the current password. Reveal is explicit, and closing the editor clears its fields. Edit tokens expire after two minutes. Deletion requires confirmation, and stale edits or duplicate accounts cannot overwrite another login.

The key button still fills a single exact-origin HTTPS account immediately. Multiple accounts open a searchable picker without the old 12-account limit. Moving to another tab or navigating cancels the pending choice. No automatic submission occurs. Private cannot access the vault. Lists and normal UI snapshots contain account metadata, never passwords; the vault remains encrypted through Electron safeStorage/macOS Keychain. This is not Apple Passwords synchronization, and editing/reveal does not add biometric authentication.

### Recovery

Normal sessions now store a bounded back/forward stack (up to 25 URL/title entries per tab) and the current main-frame scroll position. Tabs remain lazy until selected. Snapshots retain at most 150 tabs, use atomic replacement with a last-good backup, and fall back to that backup if the primary file is malformed. Existing URL-only sessions remain readable.

Writes are coalesced for 450 ms. Scroll is sampled every five seconds and on switching/sleeping/closing. Recent changes can be lost in a sudden crash; dynamic page layouts can affect restored scroll. Only URLs, titles and coordinates are restored, never Chromium pageState, form input or Private tabs. Extensions/internal-page history and scroll within nested frames are not restored. Closed-tab recovery retains the earlier URL-only behavior.

### Validation

- 39 unit tests passed, including stale credential edits, metadata secrecy, bounded navigation and corrupt-primary backup recovery.
- Electron HTTPS fixture: encrypted edit, explicit reveal and clearing on cancel, manager rendering, 15-account picker and real form fill, navigation cancellation and Private vault exclusion passed.
- Electron recovery fixture: disk snapshot, lazy session reconstruction, sleep/wake navigation and scroll restoration, and empty form fields passed.
- Broader Electron regressions passed with favorite page-thumbnail capture explicitly skipped after its strict test failed because the host display surface was unavailable. Shell UI screenshots were captured and inspected. Private network tests verify helper lifecycle/isolation; the installed helper rejects localhost fixtures, so these are not public-site connectivity tests.

The Apple silicon app is locally ad-hoc signed and is not notarized. Native Apple Passwords integration, passkeys, real-device permission testing, matched Arc performance measurements, update distribution and public-site Private-network validation remain future work.

## 0.11 — browser essentials

- Find in page with match count, forward/backward navigation, Enter/Shift-Enter and Escape. The compact search row reserves page space instead of covering the Chromium view.
- Reopen closed tabs with Shift-Command-T. Keeps up to 25 entries in memory, separated by Personal/Work; does not preserve form values or back/forward stacks. Private tabs are never retained.
- History with Command-Y or Settings → History. Records up to 2,000 distinct recent HTTP(S) URLs, removes URL credentials, supports search, opening, removing and clearing. Lists show up to 200 matching entries. Private never records or displays normal history.
- Settings → Site permissions lists saved camera, microphone, location and notification choices. Requests require the active normal tab, a secure origin (or loopback), a main frame and a still-current navigation. Choices apply to the exact origin and are shared by Personal/Work. Reset returns to asking; reload the site to terminate existing access. Unknown permissions, cross-origin frame requests and all Private requests remain blocked. macOS can independently deny access; real camera/microphone and location delivery are not yet validated.

This milestone does not add password editing, Apple Passwords synchronization, cross-browser cookie migration, back/forward session restoration, an updater or distribution signing/notarization. See the remaining sequence below in NEXT-IMPLEMENTATION.md.

### Validation

34 unit tests passed. The focused Electron suite passed match counting/next result, page bounds, history and permission panes, closed-tab recovery, history removal and Private isolation (the release notes). Permission grant/rejection logic was tested with simulated prompts, including navigation changes and unsupported requests.

The broader smoke suite stopped at favorite-thumbnail capture: Electron reported “Current display surface not available for capture” on this host. Full visual regression and live device permission use remain unverified; this is a review build. The packaged app is locally ad-hoc signed, not notarized.

## 0.5 — Prism Electron 0.5 review

Implementation source: `outputs/Prism`. The older `outputs/Prism-Source` folder is a historical export, not the live development folder. The pre-change source snapshot is `work/checkpoints/prism-electron-before-0.5.tar.gz`.

### Delivered

Electron 44.5.1 (current stable at verification), native Liquid Glass bridge, spaces, ephemeral Private sessions, explicit Private Zapret controller, conservative tab suspension, native-preview bookmark import, encrypted import backups/Undo, password form safety checks, theme editing/import/export, and a local Figma kit.

The Zapret helper is not bundled: this Mac already has version 72.13 at `/opt/zapret/tpws/tpws`. On a Mac without that helper, Start Zapret is disabled. No privileged install, global service or root networking changes are made. Rules are intentionally a small fixed set; more complex per-site strategies need separate compatibility testing.

### Validation

`smoke-results.json` records Chromium integration checks including extensions, downloads, password handling, Private isolation, helper startup/failure, sidebar collapse and design controls. `test/reset.test.cjs` covers serialization, import rollback/undo, theme validation, CSV strictness and helper arguments. Existing parser, password, policy and settings tests continue to run.

No real passwords are used in the test suite. No accounts are signed into. The profile used by the app remains `~/Library/Application Support/Prism Prototype`; tests use unique temporary profiles.

### Remaining work

- Your Figma layout and symbols are still to be designed and supplied. The plugin is a starter and export bridge, not an approved final design.
- Validate user-selected real extensions; the local MV3 fixture does not establish full Chrome compatibility.
- Test the selected Zapret strategy against the user's actual sites/network. TCP routing is implemented; complete DNS/WebRTC protection and anonymity are not claimed.
- Native Keychain-to-Electron migration, live Arc sessions and cookie import need a separate reviewed migration. The current scoped import screens say exactly what is copied.
- Import recovery is backup-based, not a fully atomic transaction across multiple stores. If a crash interrupts a final checkpoint update, preserve the encrypted checkpoint for recovery.
- Run repeated matched Arc/Prism memory and energy workloads before claiming RAM improvements. Current tests show page renderer release and restore behavior only.
- Developer ID signing, notarization and automatic updates remain distribution work.

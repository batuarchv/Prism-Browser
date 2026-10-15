# Prism design handoff

This folder contains the Prism logo directions used by the browser project.

## Supplied assets

| File | Intended role | Notes |
| --- | --- | --- |
| `brand/source/prism-mark-gradient.svg` | square app mark | 1024 × 1024 viewBox; primary icon candidate |
| `brand/source/prism-mark-alt.svg` | alternate mark | 890.48 × 715.04 viewBox; test on light and dark glass |
| `brand/source/prism-wordmark-gradient.svg` | wide wordmark | outlined vector; suitable for welcome/about surfaces |
| `brand/source/prism-wordmark-block-gradient.svg` | compact wordmark | block treatment; suitable for title or onboarding |
| `brand/source/prism-wordmark-whytokey.svg` | display wordmark | contains a font-family reference; convert to outlines before shipping if the font is not bundled |
| `brand/source/prism-wordmark-benzin.svg` | display wordmark variant | contains a font-family reference; use only if the font license and runtime packaging are confirmed |

## Implementation rules

- Use `prism-mark-gradient.svg` for the app icon and profile mark first.
- Keep the sidebar mark optional; the sidebar should remain quiet when the window is narrow.
- Do not use a full wordmark beside every sidebar section.
- Preserve the supplied vectors. Do not redraw, auto-trace, or replace them with generated artwork.
- Create monochrome light and dark exports before wiring the logo into small controls.
- Test the mark at 16, 20, 24, 32, 64, 128, 512, and 1024 px.
- Do not depend on external fonts for the two font-based wordmarks. Convert them to paths or package a licensed font deliberately.
- Keep gradients for identity surfaces; use semantic system colors for interactive controls and text.

## Prism shell direction

- Native AppKit/SwiftUI chrome should own the sidebar, title bar, toolbar, menus, popovers, settings, downloads, and extension controls.
- The sidebar uses one glass material layer, with opaque fallbacks for reduced transparency and high contrast.
- Tab rows use a quiet surface by default and a stronger selected state. Avoid a permanent card around every row.
- Add, close, import, settings, download, theme, and sleep controls should be icon-first with tooltips and accessible labels.
- Keep the 8 px spacing grid and use 28–32 px minimum hit areas for compact controls.
- Use system symbols for common actions and custom Prism symbols only for Prism-specific concepts.

## Before shipping an asset

- Confirm its intended light/dark background.
- Confirm its minimum readable size.
- Check contrast against the glass material.
- Confirm a monochrome fallback exists.
- Confirm the file is vector and has no external font dependency.
- Confirm the asset is used for identity rather than decoration.

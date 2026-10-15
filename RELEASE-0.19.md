# Prism 0.19

- Hidden sidebar now leaves matching 6px page gutters and aligns traffic lights with the toolbar. Fullscreen remains edge to edge.
- Closing the active tab returns to the most recently selected surviving tab in the current space, including favorites.
- Memory pressure release prioritizes heavier eligible renderer processes, discounts shared processes, and rechecks pressure between releases. Automatic batches allow four tabs; manual cleanup allows eight. Existing active/form/media/capture protections remain.
- Preserve the icon resource from the user's latest outputs/Prism.app. No logo redesign.
- AI-ROADMAP.md proposes GPT, Gemini and Siri features; these are not newly enabled.

Validation: seven focused unit tests passed. Focused Electron checks passed for favorite-tab return, collapsed page bounds, traffic-light position and sidebar restoration. The renderer screenshot excludes native child views, so it is not a full composited-window visual check. RAM reduction varies with workload; no measured percentage is claimed. Automatic update publishing remains unconfigured.

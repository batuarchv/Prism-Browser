# Prism project site

The Prism GitHub Pages landing page is in this directory. It is plain HTML, CSS, and JavaScript; no build tool or package installation is needed.

- `config.js` holds the links to the repository, releases and install notes.
- `js/glass-logo.js` and `js/glass-model.js` are copies of the app's live WebGL glass logo (`src/` in the app source). Drag it to turn it, click it to switch the light. Browsers without WebGL2 show `assets/prism-glass-dark.png`.
- `assets/shots/` are real Prism windows, captured with the app's isolated test profile and made-up demo pages (`PRISM_TEST_FLOW=site-shots-flow.cjs` in the app source), then cropped to JPEG.
- Liquid glass surfaces (`.glass`) use a frosted backdrop everywhere; in Chromium, `app.js` adds an SVG lens to elements marked `data-lens`, so the backdrop bends at the rim with a faint colour split.

The workflow at `.github/workflows/pages.yml` deploys this directory to GitHub Pages after pushes to `main` that change the site or workflow.

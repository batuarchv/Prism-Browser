# Prism project site

The Prism GitHub Pages landing page is in this directory. It is plain HTML, CSS, and JavaScript; no build tool or package installation is needed.

The links in `config.js` point to the public Prism repository and its releases. The workflow at `.github/workflows/pages.yml` deploys this directory to GitHub Pages after pushes to `main` that change the site or workflow.

To enable deployment once, open the repository settings, select **Pages**, and choose **GitHub Actions** as the build and deployment source.

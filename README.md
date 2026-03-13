# Vetle – Geologi og Geofare

Personal portfolio website showcasing geology studies and bachelor thesis work at Høgskulen på Vestlandet in Sogndal.

## Deployment

The site is automatically deployed to GitHub Pages on every push to `main` via the included GitHub Actions workflow.

## Renaming the Repository

Renaming this repository will **not** break the website because:

- The GitHub Pages deployment workflow uses standard actions with no hardcoded repository name.
- All links in the site are relative — no absolute URLs reference the repository name.
- GitHub will automatically redirect the old repository URL to the new one.

> **Note:** The GitHub Pages URL will update to reflect the new repository name (e.g. `https://<user>.github.io/<new-repo-name>/`). Update any external bookmarks or links accordingly.

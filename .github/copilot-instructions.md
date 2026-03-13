# Copilot Instructions – vetle-lunde-site

## Project Overview

This is a **static portfolio website** for Vetle Øyvind Larsen Lunde, showcasing geology studies and bachelor thesis work at Høgskulen på Vestlandet in Sogndal.

- **Stack**: Vanilla HTML, CSS, and JavaScript — no frameworks or build tools
- **Languages**: Bilingual — Norwegian Bokmål (`nb`) and English (`en`) with inline i18n
- **Testing**: Playwright end-to-end tests
- **Deployment**: GitHub Pages via GitHub Actions (push to `main`)
- **Live site**: `https://Lundev42.github.io/vetle-lunde-site/`

## Repository Structure

```
vetle-lunde-site/
├── index.html              # Single-page site (HTML + embedded CSS + inline JS)
├── tests/
│   └── site.spec.js        # Playwright e2e tests
├── playwright.config.js    # Playwright configuration (file:// base URL)
├── package.json            # devDependencies: @playwright/test
├── .github/
│   ├── workflows/
│   │   └── deploy.yml      # GitHub Pages deployment
│   ├── agents/
│   │   └── frontend-dev.md # Front-end developer agent
│   └── copilot-instructions.md
├── logo.webp
├── standard_hvl.jpg
├── IMG_3906.JPG
├── IMG_7173.JPG
├── IMG_7509.jpeg
└── README.md
```

## Coding Conventions

### HTML / CSS / JavaScript
- All code lives in a single `index.html` file (embedded `<style>` and `<script>` tags)
- Dark theme design: background `#0f1117`, text `#c0c8d8`, accent `#6384ff`
- Google Fonts: **Inter** (body) and **Courgette** (decorative headings)
- CSS uses flexbox layout with responsive breakpoints
- JavaScript is plain ES5-compatible (no modules, no transpilation)
- No external JS libraries

### Internationalisation (i18n)
- Translations are stored in an inline `translations` object with `nb` and `en` keys
- HTML elements use `data-i18n`, `data-i18n-html`, and `data-i18n-alt` attributes
- Language preference is saved to `localStorage`
- Default language is Norwegian Bokmål (`nb`)
- All user-facing text **must** have both `nb` and `en` translations

### Images
- Local images are used (no CDN, no external hosting except Unsplash)
- Images are stored in the project root

## Testing

- **Framework**: Playwright (`npx playwright test`)
- **Config**: `playwright.config.js` — Chromium only, file-based base URL
- **Tests**: `tests/site.spec.js` — 15 e2e tests covering:
  - Bacheloroppgave section images and captions
  - Hero section background, overlay, and CTA button
  - i18n language switching (title, alt text, toggle label)
  - Norwegian Bokmål correctness (no Nynorsk words)

### Running Tests
```bash
npm install
npx playwright install chromium
npx playwright test
```

## Deployment

The site deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. No build step is needed — the entire repository root is uploaded.

## Important Rules

1. **Keep it static** — do not add build tools, frameworks, or bundlers
2. **Bilingual always** — every text change must update both `nb` and `en` translations
3. **Test before merging** — all Playwright tests must pass
4. **Accessibility** — use semantic HTML, alt text for images, and keyboard-navigable links
5. **Performance** — optimise image sizes; keep the page lightweight
6. **No Nynorsk** — Norwegian text must be Bokmål only

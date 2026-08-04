# Shiladitya Majumder — Portfolio

A responsive monochrome portfolio built with semantic HTML, modern CSS, and lightweight JavaScript. It is designed for direct deployment to GitHub Pages without a build step.

## Included improvements

- Solid, full-height mobile navigation that remains correct after scrolling
- Scroll locking and restoration while the mobile menu is open
- Accessible menu state, Escape-key support, focus handling, and inert background content
- Consistent Inter typography across headings, body copy, navigation, labels, and buttons
- Professionally rewritten portfolio content based on the supplied résumé
- Refined responsive spacing, text widths, section alignment, and mobile type scale
- Light theme by default with a persistent optional dark theme
- Animated network globe rendered without external JavaScript libraries

## Structure

```text
.
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── assets
    ├── css/styles.css
    ├── js/main.js
    ├── icons/favicon.svg
    ├── images/social-preview.png
    └── files/Shiladitya_Majumder_Resume.pdf
```

## Deploy to GitHub Pages

1. Open the repository named `shiladityamajumder.github.io`.
2. Upload the contents of this folder to the repository root.
3. Commit the changes to the default branch.
4. In **Settings → Pages**, use **Deploy from a branch**, select the default branch, and choose `/ (root)`.
5. Open `https://shiladityamajumder.github.io/` after deployment completes.

## Main files

- Portfolio content and metadata: `index.html`
- Visual design and responsive behavior: `assets/css/styles.css`
- Navigation, theme, scroll effects, and animated globe: `assets/js/main.js`
- Downloadable résumé: `assets/files/Shiladitya_Majumder_Resume.pdf`

## Notes

- The first visit opens in the white light theme. A visitor’s later theme selection is stored locally in the browser.
- Google Fonts supplies Inter, with system-font fallbacks if the font service is unavailable.
- Project cards link to the GitHub repositories page because exact project repository URLs were not supplied.
- Update the canonical URL, sitemap, and Open Graph URLs if the GitHub username or domain changes.

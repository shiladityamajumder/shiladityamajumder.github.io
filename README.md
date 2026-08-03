# Shiladitya Majumder — Portfolio

A responsive, monochrome personal portfolio built with semantic HTML, modern CSS, and lightweight JavaScript. It is designed for direct deployment to GitHub Pages without a build step.

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

1. Create or open the repository named `shiladityamajumder.github.io`.
2. Upload the contents of this folder to the repository root.
3. Commit and push to the default branch.
4. In **Settings → Pages**, select **Deploy from a branch**, then choose the default branch and `/ (root)`.
5. Open `https://shiladityamajumder.github.io/` after GitHub finishes deployment.

## Update content

- Main portfolio content: `index.html`
- Visual design and responsiveness: `assets/css/styles.css`
- Navigation, theme toggle, scroll effects: `assets/js/main.js`
- Downloadable résumé: `assets/files/Shiladitya_Majumder_Resume.pdf`

## Notes

- The theme toggle preserves the selected monochrome light or dark mode in the browser.
- The website uses no frontend framework, package manager, CDN, or external font dependency.
- Project cards currently link to the GitHub repositories page because exact project repository URLs were not supplied.
- Update the canonical URL, sitemap, and Open Graph URLs if the GitHub username or domain changes.

# Static HTML portfolio

This is the dependency-free version of the original Next.js portfolio.

## Files

- `index.html` — the complete portfolio page
- `styles.css` — original visual styling
- `script.js` — theme toggle, mobile menu, reveal effects, active navigation, and animated network globe
- `assets/` — résumé, favicon, and social preview image
- `404.html` — static not-found page
- `.nojekyll` — keeps GitHub Pages from applying Jekyll processing

## Run locally

You can simply double-click `index.html` and open it in a browser.

For the most accurate local behavior, run any tiny static server from this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

For a repository named `shiladityamajumder.github.io`, put these files in the repository root, commit, and push. In GitHub repository settings, set Pages to deploy from the branch/root folder if it is not already configured.

No Node.js, npm, Next.js build, or package installation is required.

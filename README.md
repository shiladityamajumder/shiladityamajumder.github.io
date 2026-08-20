# Shiladitya Majumder — Portfolio

Static, responsive portfolio built with semantic HTML, modern CSS, and lightweight vanilla JavaScript. No build step is required.

## Visual modes

The site uses one shared modern layout with three deliberately different visual identities. The theme button cycles directly through them in this order:

1. **Tech Blue** — the default landing mode, using Space Grotesk + Manrope, white surfaces, electric blue accents, architecture cards, and backend-system motion.
2. **Monochrome** — a restrained black-and-white engineering mode using IBM Plex Sans + IBM Plex Mono.
3. **Pastel Joy** — a bright, expressive mode using Caveat for display typography and Nunito for readable body copy, with pastel gradients and playful hand-drawn details.

The selected mode is saved in `localStorage` and reused on the next visit.

## Files

- `index.html` — portfolio content and semantic structure
- `styles.css` — responsive layout, all three themes, animations, and 404 styling
- `script.js` — direct 1 → 2 → 3 theme cycling, mobile navigation, reveal effects, active navigation, and pointer-based architecture-card motion
- `404.html` — theme-aware custom not-found page
- `assets/files/Shiladitya_Majumder_Resume.pdf` — downloadable résumé
- `assets/icons/favicon.svg` — favicon
- `assets/images/social-preview.png` — social preview image

## Run locally

Any static web server works. For example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

The repository is ready for GitHub Pages. Keep `.nojekyll` at the repository root and publish the root directory.

### Theme control refinement
The three-mode theme switcher is now a compact icon-only palette control with a subtle three-position indicator. Tech Blue remains the default theme for visitors without a saved preference; theme changes still cycle Tech → Mono → Pastel and persist locally.

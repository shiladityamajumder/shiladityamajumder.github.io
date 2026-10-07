# Shiladitya Majumder — Backend Software Engineer

A responsive portfolio built with semantic HTML, CSS, and vanilla JavaScript. It presents my backend engineering experience, technology stack, GitHub projects, technical writing, and contact details.

[Visit the portfolio](https://shiladityamajumder.github.io/) · [GitHub profile](https://github.com/shiladityamajumder) · [Read on Medium](https://shiladityamajumder.medium.com/)

## Features

- Dark neon visual style with a custom code-and-system logo and optimized WebP illustrations.
- Hero introduction that types in when the heading enters view.
- Section shortcuts and top navigation that follow the current scroll position.
- Responsive navigation and layouts for phones, tablets, and desktop screens.
- Button light sweeps, card illumination, keyboard focus indicators, and reduced-motion support.
- Downloadable résumé and direct links to projects, writing, and contact channels.
- Custom 404 page, crawler instructions, and a sitemap.

## Project structure

```text
.
├── index.html
├── 404.html
├── LICENSE
├── README.md
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── .gitignore
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── docs/Shiladitya_Majumder_Resume.pdf
    └── images/
        ├── brand-mark.svg
        ├── hero.webp
        ├── about.webp
        ├── about-engineering.webp
        ├── journey-network.webp
        ├── footer-network.webp
        ├── visscan-v2.webp
        ├── cargoflow-v2.webp
        ├── fastapi-auth-v2.webp
        └── django-auth-v2.webp
```

## Run locally

No package installation or build step is needed. From the project directory, run:

```sh
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000/). Visit [/404.html](http://localhost:8000/404.html) to preview the error page. A simple development server may use its own default response for nonexistent URLs; GitHub Pages serves the custom 404 page after deployment.

Google Fonts loads Inter and JetBrains Mono when available; the CSS includes system font fallbacks.

## Publish with GitHub Pages

This site is configured for the user-site repository [shiladityamajumder.github.io](https://github.com/shiladityamajumder/shiladityamajumder.github.io).

1. Commit the files to the repository's `main` branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/ (root)**, then save.
5. After GitHub finishes publishing, visit [shiladityamajumder.github.io](https://shiladityamajumder.github.io/).

The empty `.nojekyll` file keeps the site as plain static files. GitHub Pages uses the root `404.html` for missing routes. The error page's root-relative asset and navigation links also work at nested missing URLs.

See [GitHub's Pages configuration documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Update the portfolio

- Edit content, social links, experience, and projects in `index.html`.
- Adjust styling and breakpoints in `assets/css/styles.css`.
- Update typing, navigation, and pointer interactions in `assets/js/main.js`.
- Replace the résumé in `assets/docs/`, keeping its filename or updating the download link.
- Keep image references synchronized with files in `assets/images/`; remove superseded assets.
- If the public domain changes, update the canonical URL in `index.html`, the sitemap URL in `robots.txt`, and the location in `sitemap.xml`.
- Update the sitemap's `lastmod` date when the homepage content materially changes.

The sitemap lists the homepage only because the portfolio sections are anchors within one page. The 404 page is marked `noindex`.

## License

Copyright © 2026 Shiladitya Majumder. All rights reserved.

The existing repository's license is preserved in [LICENSE](LICENSE). Reusing, redistributing, or publishing this portfolio's design or content requires written permission.

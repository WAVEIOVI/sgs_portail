# SGS Portail

This project is a supplier portal for WAVE VI × SGS Printing Services.

## Local development

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## GitHub Pages deployment

This project is configured to publish the `dist` directory to GitHub Pages via GitHub Actions.

The site URL will be:

```
https://waveiovi.github.io/sgs_portail
```

### Update workflow

1. Make changes locally.
2. Commit your work:

```bash
git add .
git commit -m "Update dashboard and deployment"
```

3. Push to GitHub:

```bash
git push origin main
```

4. GitHub Actions will build the project and deploy the `dist` folder to the `gh-pages` branch.

Your site will update automatically after the workflow completes.

## Manual GitHub Pages deploy

If you need to deploy manually, run:

```bash
npm run build
```

Then upload the contents of `dist/` to the `gh-pages` branch or the `docs/` folder in GitHub.

# SGS Portail

This project is a supplier portal for WAVE VI × SGS Printing Services.

Data is served from static JSON files in `public/data/` (no backend, database, or IndexedDB).

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

## Local development (auto-save)

When running `npm run dev` on `http://localhost:3000`, admin changes are **automatically written** to `public/data/*.json` after each save action. Refresh the browser and your data persists.

This uses a dev-only Vite API (`POST /__api/local-data`) — it is **not included in production builds** and does not run on GitHub Pages.

## Updating portal data (admin)

1. Edit data in the portal while signed in as admin, or edit `public/data/*.json` directly.
2. If editing in the portal, use **Settings → Publish Data → Download JSON Files**.
3. Replace files in `public/data/` and commit to `main`.
4. GitHub Actions redeploys; all users receive updated data automatically.

See [DATA-MIGRATION.md](./DATA-MIGRATION.md) for JSON schemas and IndexedDB migration steps.

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

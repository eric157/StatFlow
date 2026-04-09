# StatFlow

StatFlow is a premium analytical console that layers AI reasoning, a decision wizard, and guided method details on top of a custom React + Vite shell. The repository is configured to publish the built UI to GitHub Pages so the app can live at `https://<owner>.github.io/<repo>/` (or the default GH Pages hosting URL if the repo is named `username.github.io`).

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (`localhost:5173`). |
| `npm run build` | Bundle the app for production (`dist/`). |
| `npm run preview` | Serve the production build locally. |

## GitHub Pages

The site is deployed through the workflow defined in `.github/workflows/gh-pages.yml`. The workflow:

1. Checks out the repository.
2. Installs dependencies and runs `npm run build`.
3. Uses `peaceiris/actions-gh-pages` to push `dist/` to the `gh-pages` branch.

Vite’s config (`vite.config.js`) automatically sets the `base` path when the build is triggered with `GH_PAGES=true` (as it is in the workflow). On local or other environments, you can manually override the base using the `VITE_BASE_PATH` environment variable if needed:

```bash
VITE_BASE_PATH='/custom-path/' npm run build
```

Because the workflow also sets `GH_PAGES=true`, the Vite build resolves the base URL from `GITHUB_REPOSITORY` and publishes assets under `/StatFlow/` on the hosted page, keeping routing and asset loading correct.

# GitHub Pages setup

Checked on 2026-10-14 against `package.json`, `deploy.sh`, `.github/workflows/deploy.yml`, `public/index.html`, `public/404.html`, and the GitHub Pages API for `Jordan-Ryan/magical-chore-tracker`.

The Pages API reported:

- `html_url`: `https://jordan-ryan.github.io/magical-chore-tracker/`
- `status`: `built`
- `build_type`: `legacy`
- `source.branch`: `gh-pages`
- `source.path`: `/`

That source setting lives in GitHub repository settings. It is not stored in git.

`package.json` `homepage` is `https://jordan-ryan.github.io/magical-chore-tracker`. Production builds use it as the asset base path.

## Publish the `gh-pages` branch

This matches the Pages source above.

```bash
npm run deploy
```

`predeploy` runs `npm run build`. `deploy` runs `gh-pages -d build`, which publishes the `build/` directory to the `gh-pages` branch.

`deploy.sh` does the same publish after an optional `npm install` and an extra `npm run build`.

`origin/gh-pages` exists and contains a built site (`index.html`, `static/`, `404.html`, `manifest.json`) plus `.github/workflows/deploy.yml`. This docs pass did not compare that build with a fresh build of `main`.

## GitHub Actions workflow

`.github/workflows/deploy.yml` is named "Deploy to GitHub Pages" and is `active`. It runs on push to `main` and on `workflow_dispatch`.

The job uses `ubuntu-latest`, `actions/setup-node@v4` with Node.js 18 and the npm cache, `npm ci`, and `npm run build`. It uploads `./build` with `actions/upload-pages-artifact@v3` and deploys with `actions/deploy-pages@v4`. Permissions are `contents: read`, `pages: write`, and `id-token: write`. Concurrency group is `pages` with `cancel-in-progress: false`.

`actions/deploy-pages` is a different publish path from `gh-pages -d build`. The Pages API check above reported the legacy `gh-pages` branch source.

`gh run list` for this repository returned no workflow runs at the time of this check.

## Single-page redirects

`public/404.html` uses the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) redirect with `pathSegmentsToKeep = 1`. `public/index.html` restores the path from the query string before React mounts. The in-app screens are tab state in `src/App.tsx`. There is no React Router.

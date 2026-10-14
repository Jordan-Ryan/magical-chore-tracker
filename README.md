# Chore Chart for Kids

Client-side chore chart. The npm package name is `chore-chart-for-kids`, version `1.0.0`, and `private` is `true`. The UI title is "Chore Chart" / "Magical Owl Rewards".

Behavior implemented in `src/` is described in [docs/STATE.md](docs/STATE.md). Notes for changes in this repo are in [AGENTS.md](AGENTS.md). Deploy steps are in [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md).

## Run locally

`react-scripts@5.0.1` declares `node: >=14.0.0`. The GitHub Actions workflow installs Node.js 18 and runs `npm ci`. The lockfile in the repo is `package-lock.json`.

```bash
git clone https://github.com/Jordan-Ryan/magical-chore-tracker.git
cd magical-chore-tracker
npm install
npm start
```

`npm start` runs `react-scripts start`. Create React App prints the local URL. Its default port is 3000.

The app does not read environment variables. No `.env` file is required to start it.

## Scripts

| Script | Command |
| --- | --- |
| `start` | `react-scripts start` |
| `build` | `react-scripts build` (output directory `build/`) |
| `test` | `react-scripts test` |
| `eject` | `react-scripts eject` |
| `predeploy` | `npm run build` |
| `deploy` | `gh-pages -d build` |

`npm test` is wired to Create React App's test runner. The repository has no `*.test.*` or `*.spec.*` files.

`deploy.sh` checks that `package.json` is in the current directory, runs `npm install` when `node_modules/` is missing, runs `npm run build`, then runs `npm run deploy`. `npm run deploy` runs `predeploy`, so that path builds a second time before `gh-pages` publishes `build/`.

## Pages URL in config

`package.json` `homepage` is `https://jordan-ryan.github.io/magical-chore-tracker`. Create React App uses that value as the production asset base path. GitHub Pages settings for this repository are recorded in [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md).

## Stack

- React 18 and TypeScript, built with `react-scripts` 5.0.1
- UI libraries imported from `src/`: `framer-motion`, `lucide-react`, `date-fns`, `uuid`, `react-hot-toast` (the `Toaster` component is mounted)
- Styling is CSS in `src/**/*.css`. `public/index.html` loads the Fredoka font from Google Fonts
- State is React state plus `localStorage` key `choreChartState`

`package.json` also depends on `react-confetti` and `use-sound`. Neither package is imported under `src/`.

## Layout

```
src/                 React app (App.tsx, components, types, default data)
public/              index.html, 404.html, manifest.json, favicon.ico
.github/workflows/   deploy.yml
deploy.sh            local build-and-publish script
```

`public/index.html` links `logo192.png`. That file is not in `public/`. `public/favicon.ico` is an empty file.

This repository does not include a `LICENSE` file.

# Agent notes

This repo is a Create React App (`react-scripts` 5.0.1) TypeScript client. The app entry is `src/index.tsx`, which renders `src/App.tsx`. There is no server, database, or `process.env` usage under `src/`.

Read [docs/STATE.md](docs/STATE.md) before describing or changing behavior. Prefer `src/`, `package.json`, `deploy.sh`, and `.github/workflows/deploy.yml` over older prose.

## Commands

```bash
npm install
npm start
npm run build
npm test
npm run deploy
```

CI installs with `npm ci` on Node.js 18 (`.github/workflows/deploy.yml`). `react-scripts@5.0.1` declares `node: >=14.0.0`. The lockfile is `package-lock.json`.

`npm test` starts the Create React App runner. There are no test files in the repo.

## Where things live

- Default chores and rewards: `src/data/constants.ts`
- Types: `src/types/index.ts`
- Completion, approval, rewards, and `localStorage`: `src/App.tsx`
- Screens: `src/components/`
- Pages publish: `deploy.sh`, `npm run deploy`, and `.github/workflows/deploy.yml` (see [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md))

Persisted state is the `choreChartState` key in `localStorage`.

## Editing

`aces.json` is repository metadata (`status`, `progress`, `previewUrl`). The app does not import it.

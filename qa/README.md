# QA suite (development only)

This folder is **not** part of the public website.

It contains:

- Playwright tests (`tests/`)
- Playwright config
- Historical visual regression screenshots (`screenshots/`) — optional, large; safe to delete before deploy

## Run

From repo root (requires Node for QA only):

```bash
python -m http.server 8765
npm test
```

Or let Playwright start the server via `webServer` in `playwright.config.mjs`.

```bash
npm run test:smoke
npm run test:nav
npm run test:overflow
```

## Production deploy

Exclude the entire `qa/` directory and `node_modules/` from the public document root.

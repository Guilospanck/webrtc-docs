# Local GitHub Pages Deploy Design

**Goal:** Add a local deploy script that syncs Notion content, builds the Astro site, and publishes `dist/` to the `gh-pages` branch.

## Architecture
- Use the `gh-pages` npm package to publish `dist/`.
- Provide a single `npm run deploy` script that runs `sync`, `build`, then `gh-pages -d dist`.
- Keep GitHub Actions workflow unchanged; local deploy is a fallback.

## Components
- **Dependency:** add `gh-pages` as a dev dependency.
- **Scripts:**
  - `deploy`: `npm run sync && npm run build && gh-pages -d dist`
- **Env:** local `.env` should include:
  - `NOTION_TOKEN`
  - `NOTION_ROOT_PAGE_ID`
  - Optional `SITE_URL` and `BASE_PATH` for proper link generation

## Data Flow
1. `npm run sync` pulls Notion content into `src/content/docs/`.
2. `npm run build` produces static output in `dist/`.
3. `npm run deploy` publishes `dist/` to `gh-pages`.

## Error Handling
- Missing Notion env vars fail fast in the sync script.
- Deployment failures surface git auth errors without altering repository state.

## Testing
- No new tests; deploy is a thin wrapper around existing steps.
- Optional manual verification: open `dist/index.html` after build.

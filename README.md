# Notion WebRTC Docs

Static docs site powered by Astro, generated from the Notion page **“📡 WebRTC”** and its subpages.

## Overview
- Fetches Notion content at build time
- Converts blocks to Markdown
- Renders with Astro docs layout + sidebar
- Deploys to GitHub Pages via the local deploy command

## Requirements
- Node.js 20+
- A Notion integration token with access to the WebRTC page

## Setup
1. Install dependencies:

```bash
npm install
```

2. Create a local `.env` (not committed):

```env
NOTION_TOKEN=secret_xxx
NOTION_ROOT_PAGE_ID=2f980e39-00fd-8084-8af0-c2c50d001733
SITE_URL=https://<owner>.github.io/<repo>
BASE_PATH=/
```

## Scripts
- `npm run dev` – start Astro dev server
- `npm run sync` – pull Notion content into `src/content/docs/`
- `npm run build` – build static site
- `npm run preview` – preview build locally
- `npm run test` – run unit tests
- `npm run lint` – typecheck (`tsc --noEmit`)
- `npm run deploy` – sync, build, and publish to `gh-pages`

## Notion Sync
The sync script pulls pages from Notion and writes:
- Markdown files to `src/content/docs/`
- Navigation tree to `src/content/docs/_nav.json`

Generated content is ignored by git; run `npm run sync` locally or in CI.

## Deploy
To deploy to GitHub Pages, run the local deploy script. Make sure your `.env` is set up first.

```bash
npm run deploy
```

## Notes
- The root Notion page ID is currently set to the WebRTC page: `2f980e39-00fd-8084-8af0-c2c50d001733`.
- If you change the root page, update `.env`.

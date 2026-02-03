# Notion WebRTC Docs

Static docs site powered by Astro, generated from the Notion page **“📡 WebRTC”** and its subpages.

## Overview
- Fetches Notion content at build time using Notion API
- Converts blocks to Markdown
- Renders with Astro docs layout + sidebar
- Deploys to GitHub Pages via the local deploy command

## Requirements
- Node.js 20+
- A Notion integration token with access to the desired root page

## Setup
1. Install dependencies:

```bash
npm install
```

2. Get a Notion token:

Go to [Notion Integrations](https://www.notion.so/profile/integrations) and create your own with the necessary capabilities that you desire.

3. Get a Notion root page id:

Use the script `./scripts/notion-query-page.ts` (or just add [Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) to your AI and ask it directly).

4. Copy `.env.example` into `.env` (`cp .env.example .env`) and fill in with your information:

```env
NOTION_TOKEN=secret_xxx
NOTION_ROOT_PAGE_ID=<notion-root-page-id>
SITE_URL=https://<owner>.github.io/<repo-name>
BASE_PATH=/<repo-name>/
```

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

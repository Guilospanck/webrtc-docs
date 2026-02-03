# WebRTC Notion Docs Design

**Goal:** Build a static Astro docs site that pulls content from the Notion page "📡 WebRTC" and its subpages at build time, preserving Notion order and rendering a sidebar layout.

## Scope
- Root page: "📡 WebRTC" (Notion page ID: 2f980e39-00fd-8084-8af0-c2c50d001733)
- Include only the WebRTC subtree (exclude the parent "Studies" page in nav)
- Build-time sync from Notion using a private integration token
- Static site hosted on GitHub Pages

## Architecture
- A build-time sync script fetches the WebRTC page tree, converts Notion blocks to Markdown, and writes files to `src/content/docs/`.
- Astro content collections render Markdown into a docs layout with sidebar navigation.
- Sidebar order follows Notion page order, captured in a generated `src/content/docs/_nav.json`.

## Components
### Notion Sync Script
- Uses Notion API + a converter (e.g., `@notionhq/client` + `notion-to-md`)
- Traverses pages in Notion order
- Writes Markdown per page with frontmatter: `title`, `slug`, `order`, `parent`, `notionId`
- Generates `src/content/docs/_nav.json` for nested nav rendering

### Astro Site
- Content collection in `src/content/docs`
- Docs layout renders sidebar from `_nav.json`
- `/docs` routes to first doc or dedicated landing page

## Data Flow
1. `npm run sync` pulls Notion content into Markdown
2. `npm run build` renders static pages with Astro
3. GitHub Pages deploys the built site

## Error Handling
- Fail fast if `NOTION_TOKEN` missing
- Surface Notion API errors clearly in CI
- Unsupported block types render fallback text + warning log
- Empty pages generate a placeholder to avoid broken links
- Slug conflicts resolve with short suffix from Notion page ID

## Testing
- Unit tests for slug generation, page ordering, tree traversal
- Snapshot tests for Markdown conversion of common block types
- Optional integration test using Notion API when token is present
- Build-time validation for `_nav.json` references

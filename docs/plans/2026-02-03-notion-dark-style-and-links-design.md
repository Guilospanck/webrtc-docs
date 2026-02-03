# Notion Dark Style + Links Design

**Goal:** Make the docs UI feel like Notion dark mode, rewrite internal Notion links to local docs, and include linked pages in navigation at any depth.

## Architecture
- Enhance the sync pipeline to include both `child_page` and `link_to_page` blocks in the page tree.
- Build a Notion page ID → slug map, then rewrite internal Notion links to `/docs/<slug>/` during Markdown generation.
- Render the sidebar recursively to support unlimited nesting.
- Redesign CSS to match Notion dark theme: soft contrast, muted borders, calm typography, and spacious layout.

## Components
### Sync Enhancements
- `scripts/notion-sync.ts`
  - Include `link_to_page` blocks when walking children.
  - Maintain a map of page IDs to slugs for link rewriting.
  - Rewrite Notion page URLs in Markdown when target is inside the subtree.
  - Leave external links and out-of-scope Notion links unchanged.

### Sidebar Rendering
- `src/layouts/DocsLayout.astro`
  - Replace the two-level map with a recursive renderer so all nested pages appear.

### Notion‑Like Dark Theme
- `src/styles/global.css`
  - Dark background layers, soft borders, muted text
  - Typography closer to Notion (smaller headings, higher line height)
  - Clean link styling and code block treatment

## Data Flow
1. Sync builds a complete tree including linked pages.
2. Markdown is generated and internal links are rewritten.
3. Sidebar renders all depths from the nav tree.
4. Styling applies Notion-like dark theme.

## Error Handling
- `link_to_page` outside subtree: keep original Notion URL.
- Unknown page ID: warn and keep original URL.
- Duplicate slugs: existing unique-slug logic remains.

## Testing
- Unit test: internal link rewriting (Notion URL → local slug).
- Unit test: `link_to_page` inclusion in tree build.

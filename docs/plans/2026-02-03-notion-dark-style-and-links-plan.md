# Notion Dark Style + Links Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the docs UI feel like Notion dark mode, rewrite internal Notion links to local docs, and include linked pages in navigation at any depth.

**Architecture:** Extend the sync pipeline to include `link_to_page` blocks and rewrite internal Notion links to local slugs. Render the sidebar recursively and apply a Notion-like dark theme via CSS variables and typography adjustments.

**Tech Stack:** Astro, TypeScript, Notion API, notion-to-md

### Task 1: Add link rewriting utilities

**Files:**
- Create: `scripts/notion-link-utils.ts`
- Test: `tests/notion-link-utils.test.ts`

**Step 1: Write failing tests**

```ts
import { describe, it, expect } from "vitest";
import { rewriteNotionLinks } from "../scripts/notion-link-utils";

it("rewrites internal Notion page URLs to local docs slugs", () => {
  const md = "See https://www.notion.so/abc123 and https://www.notion.so/xyz789";
  const map = new Map([
    ["abc123", "general"],
    ["xyz789", "metrics"],
  ]);
  expect(rewriteNotionLinks(md, map)).toBe(
    "See /docs/general/ and /docs/metrics/"
  );
});

it("keeps external links unchanged", () => {
  const md = "Visit https://example.com";
  const map = new Map();
  expect(rewriteNotionLinks(md, map)).toBe(md);
});
```

**Step 2: Run test to verify failure**

Run: `npm test`
Expected: FAIL with missing module/exports.

**Step 3: Implement rewrite utility**

```ts
const NOTION_URL_RE = /https:\/\/www\.notion\.so\/(?:[a-zA-Z0-9\-]+-)?([a-f0-9]{32})/g;

export function rewriteNotionLinks(md: string, idToSlug: Map<string, string>): string {
  return md.replace(NOTION_URL_RE, (match, id) => {
    const slug = idToSlug.get(id);
    return slug ? `/docs/${slug}/` : match;
  });
}
```

**Step 4: Run tests to verify pass**

Run: `npm test`
Expected: PASS.

**Step 5: Commit**

Run:
```bash
git add scripts/notion-link-utils.ts tests/notion-link-utils.test.ts
git commit -m "test: add notion link rewrite utility"
```

### Task 2: Include linked pages in tree + rewrite links in sync

**Files:**
- Modify: `scripts/notion-sync-core.ts`
- Modify: `scripts/notion-sync.ts`
- Test: `tests/notion-sync-core.test.ts`

**Step 1: Update tree builder to include `link_to_page` blocks**

Add new test case to `tests/notion-sync-core.test.ts`:

```ts
it("includes link_to_page blocks as children", async () => {
  const fetchPage = async (id: string) => ({ id, properties: { title: { title: [{ plain_text: id }] } } });
  const fetchChildPages = async () => [
    { id: "linked", type: "link_to_page", link_to_page: { page_id: "linked" } },
  ];
  const pages = await buildFlatTree({ rootId: "root", fetchPage, fetchChildPages });
  expect(pages.find((p) => p.id === "linked")).toBeTruthy();
});
```

Run: `npm test` (expect failure)

Update `buildFlatTree` to accept `link_to_page` blocks by resolving `page_id` to enqueue.

Run: `npm test` (expect pass)

**Step 2: Rewrite links in sync**

In `scripts/notion-sync.ts`:
- Build a `Map<pageId, slug>` while writing pages.
- After markdown generation, call `rewriteNotionLinks`.

Example snippet:

```ts
import { rewriteNotionLinks } from "./notion-link-utils";

const idToSlug = new Map<string, string>();
...
const slug = ensureUniqueSlug(...);
idToSlug.set(page.id, slug);
const md = rewriteNotionLinks(rawMd, idToSlug);
```

**Step 3: Commit**

Run:
```bash
git add scripts/notion-sync-core.ts scripts/notion-sync.ts tests/notion-sync-core.test.ts
git commit -m "feat: include linked pages and rewrite links"
```

### Task 3: Render sidebar recursively

**Files:**
- Modify: `src/layouts/DocsLayout.astro`

**Step 1: Implement recursive nav renderer**

Replace the current two-level loop with a recursive helper function.

**Step 2: Commit**

Run:
```bash
git add src/layouts/DocsLayout.astro
git commit -m "feat: render nav recursively"
```

### Task 4: Notion-like dark theme

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Update CSS variables + typography**

Adjust background, text, borders, and link colors to match Notion dark feel.

**Step 2: Commit**

Run:
```bash
git add src/styles/global.css
git commit -m "style: apply notion dark theme"
```

### Task 5: Verify sync + build

**Files:**
- None

**Step 1: Run tests**

Run: `npm test`
Expected: PASS.

**Step 2: Run sync + build**

Run: `npm run sync && npm run build`
Expected: Build success.

**Step 3: Commit**

No commit (verification only).

# Local GH-Pages Deploy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a local `npm run deploy` command that syncs Notion content, builds the Astro site, and publishes `dist/` to the `gh-pages` branch.

**Architecture:** Use the `gh-pages` npm package as a dev dependency and a `deploy` script in `package.json` that runs `sync`, `build`, then `gh-pages -d dist`.

**Tech Stack:** Node.js, Astro, gh-pages

### Task 1: Add gh-pages dependency

**Files:**
- Modify: `package.json`

**Step 1: Install dev dependency**

Run: `npm install -D gh-pages`
Expected: `gh-pages` added to `devDependencies`.

**Step 2: Commit**

Run:
```bash
git add package.json package-lock.json
git commit -m "chore: add gh-pages dependency"
```

### Task 2: Add deploy script

**Files:**
- Modify: `package.json`

**Step 1: Add deploy script**

Add script:

```json
"deploy": "npm run sync && npm run build && gh-pages -d dist"
```

**Step 2: Commit**

Run:
```bash
git add package.json
git commit -m "feat: add local gh-pages deploy script"
```

### Task 3: Verify local deploy pipeline (manual)

**Files:**
- None

**Step 1: Run lint and tests**

Run: `npm run lint && npm test`
Expected: Both succeed.

**Step 2: Run deploy (manual verification)**

Run: `NOTION_TOKEN=... NOTION_ROOT_PAGE_ID=... npm run deploy`
Expected: `dist/` published to `gh-pages` branch.

**Step 3: Commit**

No commit (verification only).

import "dotenv/config";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildNavTree, ensureUniqueSlug, slugifyTitle } from "./notion-sync-utils";
import { buildFlatTree } from "./notion-sync-core";
import { rewriteNotionLinks } from "./notion-link-utils";

const rootId = process.env.NOTION_ROOT_PAGE_ID;
const token = process.env.NOTION_TOKEN;

if (!token) {
  throw new Error("NOTION_TOKEN is required");
}
if (!rootId) {
  throw new Error("NOTION_ROOT_PAGE_ID is required");
}

const requiredRootId: string = rootId;

const notion = new Client({ auth: token });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function listChildPages(pageId: string) {
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

async function writeDocs(pages: { id: string; title: string; parentId: string | null }[]) {
  const docsDir = join(process.cwd(), "src", "content", "docs");
  await mkdir(docsDir, { recursive: true });

  const used = new Set<string>();
  const idToSlug = new Map<string, string>();
  const normalizeId = (id: string) => id.replace(/-/g, "").toLowerCase();
  const slugsById = new Map<string, string>();

  for (const page of pages) {
    const slug = ensureUniqueSlug(slugifyTitle(page.title), page.id, used);
    slugsById.set(page.id, slug);
    idToSlug.set(normalizeId(page.id), slug);
  }

  const writtenSlugs = new Set<string>();
  for (const page of pages) {
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const rawMd = n2m.toMarkdownString(mdBlocks).parent;
    const slug = slugsById.get(page.id);
    if (!slug) {
      continue;
    }
    const md = rewriteNotionLinks(rawMd || "", idToSlug);
    const frontmatter = `---\ntitle: "${page.title}"\nnotionId: "${page.id}"\n---\n`;

    await writeFile(
      join(docsDir, `${slug}.md`),
      `${frontmatter}\n${md || "No content yet."}`
    );
    writtenSlugs.add(slug);
  }

  const nav = buildNavTree(pages).slice(1);
  await writeFile(join(docsDir, "_nav.json"), JSON.stringify(nav, null, 2));

  const missing: string[] = [];
  const stack = [...nav];
  while (stack.length) {
    const current = stack.pop()!;
    if (!writtenSlugs.has(current.slug)) {
      missing.push(current.slug);
    }
    stack.push(...current.children);
  }

  if (missing.length > 0) {
    throw new Error(`Nav references missing docs: ${missing.join(", ")}`);
  }
}

async function main() {
  const pages = await buildFlatTree({
    rootId: requiredRootId,
    fetchPage: (id) => notion.pages.retrieve({ page_id: id }) as Promise<any>,
    fetchChildPages: listChildPages,
  });

  const withoutRoot = pages.filter((page) => page.id !== requiredRootId);
  await writeDocs(withoutRoot);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

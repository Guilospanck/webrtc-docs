export type FlatPage = {
  id: string;
  title: string;
  parentId: string | null;
};

export type NavNode = {
  id: string;
  title: string;
  slug: string;
  children: NavNode[];
};

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ensureUniqueSlug(
  slug: string,
  id: string,
  used: Set<string>
): string {
  if (!used.has(slug)) {
    used.add(slug);
    return slug;
  }
  const suffix = id.split("-")[0];
  const unique = `${slug}-${suffix}`;
  used.add(unique);
  return unique;
}

export function buildNavTree(pages: FlatPage[]): NavNode[] {
  const used = new Set<string>();
  const nodes = pages.map((p) => ({
    id: p.id,
    title: p.title,
    slug: ensureUniqueSlug(slugifyTitle(p.title), p.id, used),
    parentId: p.parentId,
    children: [],
  }));

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const roots: NavNode[] = [];

  for (const node of nodes) {
    const parentId = (node as unknown as { parentId: string | null }).parentId;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
    delete (node as unknown as { parentId?: string | null }).parentId;
  }

  return roots;
}

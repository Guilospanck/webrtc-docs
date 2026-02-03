export type FlatPage = {
  id: string;
  title: string;
  parentId: string | null;
};

type NotionPage = {
  properties?: {
    title?: {
      title?: Array<{ plain_text?: string }>;
    };
  };
};

type NotionBlock = {
  id: string;
  type: string;
  link_to_page?: {
    page_id?: string;
  };
};

export function extractTitleFromPage(page: NotionPage): string {
  const title = page.properties?.title?.title?.[0]?.plain_text;
  return title && title.trim().length > 0 ? title : "Untitled";
}

export function filterChildPages(blocks: NotionBlock[]): NotionBlock[] {
  return blocks.filter(
    (block) => block.type === "child_page" || block.type === "link_to_page"
  );
}

export async function buildFlatTree(params: {
  rootId: string;
  fetchPage: (id: string) => Promise<NotionPage>;
  fetchChildPages: (id: string) => Promise<NotionBlock[]>;
}): Promise<FlatPage[]> {
  const queue: { id: string; parentId: string | null }[] = [
    { id: params.rootId, parentId: null },
  ];
  const seen = new Set<string>([params.rootId]);
  const pages: FlatPage[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    const page = await params.fetchPage(current.id);
    pages.push({
      id: current.id,
      title: extractTitleFromPage(page),
      parentId: current.parentId,
    });

    const children = filterChildPages(await params.fetchChildPages(current.id));
    for (const child of children) {
      const childId =
        child.type === "link_to_page" ? child.link_to_page?.page_id : child.id;
      if (!childId) {
        continue;
      }
      if (seen.has(childId)) {
        continue;
      }
      seen.add(childId);
      queue.push({ id: childId, parentId: current.id });
    }
  }

  return pages;
}

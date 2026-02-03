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
};

export function extractTitleFromPage(page: NotionPage): string {
  const title = page.properties?.title?.title?.[0]?.plain_text;
  return title && title.trim().length > 0 ? title : "Untitled";
}

export function filterChildPages(blocks: NotionBlock[]): NotionBlock[] {
  return blocks.filter((block) => block.type === "child_page");
}

export async function buildFlatTree(params: {
  rootId: string;
  fetchPage: (id: string) => Promise<NotionPage>;
  fetchChildPages: (id: string) => Promise<NotionBlock[]>;
}): Promise<FlatPage[]> {
  const queue: { id: string; parentId: string | null }[] = [
    { id: params.rootId, parentId: null },
  ];
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
      queue.push({ id: child.id, parentId: current.id });
    }
  }

  return pages;
}

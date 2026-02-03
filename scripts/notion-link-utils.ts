const NOTION_URL_RE = /https:\/\/www\.notion\.so\/(?:[a-zA-Z0-9\-]+-)?([a-f0-9]{6,32})/g;

function normalizeId(id: string): string {
  return id.replace(/-/g, "");
}

export function rewriteNotionLinks(
  md: string,
  idToSlug: Map<string, string>,
  basePath: string
): string {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return md.replace(NOTION_URL_RE, (match, rawId) => {
    const normalized = normalizeId(rawId);
    const slug = idToSlug.get(normalized);
    return slug ? `${base}docs/${slug}/` : match;
  });
}

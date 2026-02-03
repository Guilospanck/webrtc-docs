import { describe, it, expect } from "vitest";
import {
  extractTitleFromPage,
  filterChildPages,
  buildFlatTree,
} from "../scripts/notion-sync-core";

describe("notion-sync-core", () => {
  it("extractTitleFromPage returns plain title or Untitled", () => {
    const page = {
      properties: {
        title: {
          title: [{ plain_text: "WebRTC" }],
        },
      },
    };
    expect(extractTitleFromPage(page)).toBe("WebRTC");
    expect(extractTitleFromPage({})).toBe("Untitled");
  });

  it("filterChildPages keeps only child_page blocks", () => {
    const blocks = [
      { id: "1", type: "paragraph" },
      { id: "2", type: "child_page" },
    ];
    expect(filterChildPages(blocks)).toEqual([{ id: "2", type: "child_page" }]);
  });

  it("buildFlatTree returns pages in BFS order with parents", async () => {
    const fetchPage = async (id: string) => ({
      id,
      properties: {
        title: {
          title: [{ plain_text: id.toUpperCase() }],
        },
      },
    });

    const fetchChildPages = async (id: string) => {
      if (id === "root") {
        return [
          { id: "a", type: "child_page" },
          { id: "b", type: "child_page" },
        ];
      }
      if (id === "a") {
        return [{ id: "c", type: "child_page" }];
      }
      return [];
    };

    const pages = await buildFlatTree({
      rootId: "root",
      fetchPage,
      fetchChildPages,
    });

    expect(pages).toEqual([
      { id: "root", title: "ROOT", parentId: null },
      { id: "a", title: "A", parentId: "root" },
      { id: "b", title: "B", parentId: "root" },
      { id: "c", title: "C", parentId: "a" },
    ]);
  });
});

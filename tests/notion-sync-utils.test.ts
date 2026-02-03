import { describe, it, expect } from "vitest";
import {
  slugifyTitle,
  ensureUniqueSlug,
  buildNavTree,
} from "../scripts/notion-sync-utils";

const PAGES = [
  { id: "a", title: "General", parentId: null },
  { id: "b", title: "WebRTC - Dev", parentId: null },
  { id: "c", title: "General", parentId: null },
  { id: "d", title: "Debugging", parentId: "a" },
];

describe("notion-sync-utils", () => {
  it("slugifyTitle creates stable, lowercase slugs", () => {
    expect(slugifyTitle("WebRTC - Dev")).toBe("webrtc-dev");
  });

  it("ensureUniqueSlug avoids collisions", () => {
    const used = new Set(["general"]);
    expect(ensureUniqueSlug("general", "c", used)).toBe("general-c");
  });

  it("buildNavTree groups children under parents", () => {
    const tree = buildNavTree(PAGES);
    expect(tree[0].title).toBe("General");
    expect(tree[0].children[0].title).toBe("Debugging");
  });
});

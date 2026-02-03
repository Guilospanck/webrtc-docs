import { describe, it, expect } from "vitest";
import { rewriteNotionLinks } from "../scripts/notion-link-utils";

describe("rewriteNotionLinks", () => {
  it("rewrites internal Notion page URLs to local docs slugs", () => {
    const md =
      "See https://www.notion.so/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa and https://www.notion.so/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
    const map = new Map([
      ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "general"],
      ["bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "metrics"],
    ]);
    expect(rewriteNotionLinks(md, map, "/webrtc-docs/")).toBe(
      "See /webrtc-docs/docs/general/ and /webrtc-docs/docs/metrics/"
    );
  });

  it("keeps external links unchanged", () => {
    const md = "Visit https://example.com";
    const map = new Map();
    expect(rewriteNotionLinks(md, map, "/webrtc-docs/")).toBe(md);
  });
});

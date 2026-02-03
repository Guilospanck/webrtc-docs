import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;
if (!token) {
  throw new Error("NOTION_TOKEN is required");
}

export async function queryPage(query: string) {
  const notion = new Client({ auth: token });

  const response = await notion.search({
    query,
    filter: {
      property: "object",
      value: "page",
    },
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });

  return response;
}

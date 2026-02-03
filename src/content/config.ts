import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    notionId: z.string(),
  }),
});

export const collections = { docs };

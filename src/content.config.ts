import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      // Normalize so casing/whitespace can't split a tag into duplicates
      // between the tag index (counts raw) and tag pages (group by slug).
      tags: z.array(z.string().trim().toLowerCase()).default([]),
      cover: z
        .object({
          // image() resolves relative paths under src/assets for optimization;
          // string remains for rare absolute /img/... fallbacks.
          src: z.union([image(), z.string()]),
          alt: z.string(),
          caption: z.string().optional(),
        })
        .optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo: z.url().optional(),
    homepage: z.url().optional(),
    stack: z.array(z.string()).default([]),
    pinned: z.boolean().default(false),
    archived: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    titleAccent: z.string().optional(),
    description: z.string().optional(),
    lede: z.string().optional(),
  }),
});

export const collections = { posts, projects, pages };

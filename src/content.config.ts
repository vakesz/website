import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const httpUrl = z.url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
  message: "Must use an HTTP(S) URL",
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      // Give every catalog consumer the same canonical tag labels.
      tags: z
        .array(z.string().trim().min(1).toLowerCase())
        .default([])
        .transform((tags) => [...new Set(tags)]),
      cover: z
        .object({
          src: image(),
          alt: z.string().trim().min(1),
          caption: z.string().optional(),
        })
        .optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string().default("Personal project"),
      cover: z.object({ src: image(), alt: z.string().trim().min(1) }).optional(),
      imageStyle: z.enum(["screenshot", "icon"]).default("screenshot"),
      repo: httpUrl.optional(),
      homepage: httpUrl.optional(),
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

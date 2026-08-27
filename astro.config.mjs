import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { toString } from "mdast-util-to-string";
import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";

export default defineConfig({
  site: "https://vakesz.com",
  integrations: [mdx(), sitemap()],
  // Preserve Astro 6's whitespace behavior during the v7 migration.
  compressHTML: true,
  markdown: {
    // This site has custom remark/rehype plugins, so keep Astro's unified pipeline.
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      smartypants: { dashes: false },
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            properties: (heading) => ({
              className: ["heading-anchor"],
              ariaLabel: `Permalink to ${toString(heading)}`,
            }),
            content: {
              type: "element",
              tagName: "span",
              properties: { ariaHidden: "true" },
              children: [{ type: "text", value: "#" }],
            },
          },
        ],
      ],
    }),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
      wrap: true,
    },
  },
  build: {
    format: "directory",
  },
  vite: {
    build: {
      // Keep client scripts compatible with the site's `script-src 'self'` CSP.
      assetsInlineLimit: 0,
    },
  },
});

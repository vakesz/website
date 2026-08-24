import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { SITE } from "../../consts";
import { isPublished } from "../../lib/content";

const posts = await getCollection("posts", isPublished);

const pages = Object.fromEntries(
  posts.map((p) => [
    p.id,
    {
      title: p.data.title,
      description: p.data.description,
    },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "slug",
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [9, 9, 11],
      [24, 24, 27],
    ],
    border: { color: [39, 39, 42], width: 2, side: "inline-start" },
    padding: 80,
    logo: {
      path: "./public/apple-touch-icon.png",
      size: [56],
    },
    font: {
      title: {
        size: 64,
        families: ["Inter", "system-ui", "sans-serif"],
        weight: "Bold",
        color: [250, 250, 250],
        lineHeight: 1.15,
      },
      description: {
        size: 28,
        families: ["Inter", "system-ui", "sans-serif"],
        weight: "Normal",
        color: [161, 161, 170],
        lineHeight: 1.45,
      },
    },
    fonts: [
      "./src/assets/fonts/inter-latin-400-normal.ttf",
      "./src/assets/fonts/inter-latin-700-normal.ttf",
    ],
    footer: SITE.title,
  }),
});

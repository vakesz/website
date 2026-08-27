import { OGImageRoute } from "astro-og-canvas";
import { SITE } from "../../consts";
import { loadPostCatalog } from "../../lib/content";

const { posts } = await loadPostCatalog();

if (posts.some((post) => post.id === "site")) {
  throw new Error('The post ID "site" is reserved for the default Open Graph image.');
}

interface OGPage {
  title: string;
  description: string;
}

const pages: Record<string, OGPage> = {
  site: {
    title: SITE.title,
    description: SITE.description,
  },
  ...Object.fromEntries(
    posts.map((post) => [
      post.id,
      {
        title: post.data.title,
        description: post.data.description,
      },
    ]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
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

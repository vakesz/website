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
      [20, 23, 24],
      [32, 37, 38],
    ],
    border: { color: [241, 155, 200], width: 6, side: "inline-start" },
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
        color: [239, 241, 239],
        lineHeight: 1.15,
      },
      description: {
        size: 28,
        families: ["Inter", "system-ui", "sans-serif"],
        weight: "Normal",
        color: [164, 172, 171],
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

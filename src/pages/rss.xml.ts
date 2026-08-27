import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMdxRenderer } from "@astrojs/mdx/container-renderer";
import type { APIContext } from "astro";
import { SITE, HTML_LANG } from "../consts";
import { loadPostCatalog } from "../lib/content";
import YouTube from "../components/YouTube.astro";

export async function GET(context: APIContext) {
  const site = context.site!;
  const { posts } = await loadPostCatalog();

  // Render each post body to HTML so the feed carries full content, not
  // just the description.
  const renderers = await loadRenderers([getMdxRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    const html = await container.renderToString(Content, {
      props: { components: { YouTube } },
    });
    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
      // Feed readers need absolute URLs; rewrite root-relative ones.
      content: html.replace(/(href|src)="\//g, `$1="${site.origin}/`),
    });
  }

  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    items,
    customData: `<language>${HTML_LANG}</language>`,
  });
}

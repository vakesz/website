# Editing vakesz.com

Open `/admin/` on the site, or [Pages CMS](https://app.pagescms.org/vakesz/vakesz/main).
Sign in with GitHub and authorize the Pages CMS GitHub app for `vakesz/vakesz` if it is not connected yet.

## Write a post

1. Open Blog posts and create an entry.
2. Enter a title, summary, publication date, and tags. A cover image is optional; add an image description when using one.
3. Write in the visual editor. Use Source for Markdown and for existing MDX components such as `<YouTube />`.
4. Leave Draft enabled while writing. Turn it off and save when ready to publish.

New posts use Markdown. Existing MDX articles and URLs remain supported. Filenames can be chosen when creating a post; renaming existing post files is disabled in the CMS to avoid changing their URLs.

Saving commits content to the `main` branch on GitHub. If the Cloudflare project is connected to that branch, a successful build publishes the update. Future publication dates are filtered at build time; another build is needed after the date passes.

## Edit other content

- Portfolio manages project descriptions, images, links, and technology lists. Pinned projects appear on the homepage, up to two, ordered by the Order field.
- Homepage edits the main heading and introduction.
- About page edits the page heading, introduction, and body.
- Media contains separate folders for body images, post covers, and project images.

## Hosting

The site remains a static Astro build, with no new runtime service required on Cloudflare. Keep the existing build command and `dist` output directory. The canonical origin defaults to `https://vakesz.com`; `SITE_URL` can override it for another environment.

The `/admin/` page links to the authenticated Pages CMS editors. It does not store credentials or accept unauthenticated content writes.

References: [Pages CMS quick start](https://pagescms.org/docs/quick-start/), [Cloudflare Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

# vakesz.com

Source of [vakesz.com](https://vakesz.com), my personal site and blog. It is a
static [Astro](https://astro.build) build, hosted on Cloudflare Pages.

## Develop

Needs Node 26 and pnpm 11.

```sh
pnpm install
pnpm dev            # local dev server
pnpm build          # type check and build into dist/
pnpm deploy:check   # format check, build and verify the output
```

## Write

Posts, projects and pages live in `src/content/`. They can be edited in the
repo or through Pages CMS, see [docs/editing.md](docs/editing.md).

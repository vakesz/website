import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_ORIGIN } from "../site.config.mjs";
const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return files.flat();
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2];
}

async function targetExists(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded.split("/").includes("..")) return false;

  const localPath = join(distDir, decoded.replace(/^\/+/, ""));
  const candidates = decoded.endsWith("/")
    ? [join(localPath, "index.html"), `${localPath.slice(0, -1)}.html`]
    : [localPath, join(localPath, "index.html"), `${localPath}.html`];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return true;
    } catch {
      // Try the next static-route shape.
    }
  }
  return false;
}

const files = await walk(distDir);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
check(htmlFiles.length > 0, "dist contains no HTML pages");

for (const file of htmlFiles) {
  const relativePath = relative(distDir, file).replaceAll("\\", "/");
  const page = `/${relativePath}`;
  const routePath =
    relativePath === "index.html"
      ? "/"
      : relativePath.endsWith("/index.html")
        ? `/${relativePath.slice(0, -"index.html".length)}`
        : page;
  const html = await readFile(file, "utf8");

  const robotsTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find(
    ([tag]) => attribute(tag, "name")?.toLowerCase() === "robots",
  )?.[0];
  const robots = robotsTag && attribute(robotsTag, "content");
  const noindex = robots?.split(/[\s,]+/).includes("noindex") ?? false;
  const canonicalTags = [...html.matchAll(/<link\b[^>]*>/gi)].filter(
    ([tag]) => attribute(tag, "rel") === "canonical",
  );
  check(
    canonicalTags.length === (noindex ? 0 : 1),
    `${page}: ${noindex ? "noindex pages cannot have" : "expected exactly one"} canonical link`,
  );
  if (canonicalTags[0]) {
    const canonical = attribute(canonicalTags[0][0], "href");
    try {
      const url = new URL(canonical);
      check(
        url.origin === SITE_ORIGIN &&
          url.pathname === routePath &&
          url.search === "" &&
          url.hash === "",
        `${page}: canonical must be ${SITE_ORIGIN}${routePath}`,
      );
    } catch {
      failures.push(`${page}: canonical is not a valid absolute URL`);
    }
  }

  check((html.match(/<h1\b/gi) ?? []).length === 1, `${page}: expected exactly one h1`);

  for (const [tag] of html.matchAll(/<a\b[^>]*>/gi)) {
    const classes = attribute(tag, "class")?.split(/\s+/) ?? [];
    if (!classes.includes("heading-anchor")) continue;
    check(attribute(tag, "href")?.startsWith("#"), `${page}: heading permalink needs a fragment`);
    check(
      Boolean(attribute(tag, "aria-label")?.trim()),
      `${page}: heading permalink needs an accessible name`,
    );
    check(attribute(tag, "aria-hidden") !== "true", `${page}: heading permalink cannot be hidden`);
    check(attribute(tag, "tabindex") !== "-1", `${page}: heading permalink must be focusable`);
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const tag = match[0].slice(0, match[0].indexOf(">") + 1);
    const type = attribute(tag, "type");
    const src = attribute(tag, "src");
    if (type === "application/ld+json") {
      try {
        JSON.parse(match[2]);
      } catch {
        failures.push(`${page}: invalid JSON-LD`);
      }
    } else {
      check(Boolean(src), `${page}: executable inline script is not allowed by CSP`);
      if (src) {
        try {
          const url = new URL(src, SITE_ORIGIN);
          check(url.origin === SITE_ORIGIN, `${page}: executable scripts must be same-origin`);
        } catch {
          failures.push(`${page}: invalid executable script URL ${JSON.stringify(src)}`);
        }
      }
    }
  }

  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
    for (const name of ["href", "src"]) {
      const value = attribute(match[0], name);
      if (!value || value.startsWith("#")) continue;

      let url;
      try {
        url = new URL(value, SITE_ORIGIN);
      } catch {
        failures.push(`${page}: invalid ${name} URL ${JSON.stringify(value)}`);
        continue;
      }
      if (url.origin !== SITE_ORIGIN) continue;
      check(await targetExists(url.pathname), `${page}: missing internal target ${url.pathname}`);
    }
  }

  const ogImageTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find(
    ([tag]) => attribute(tag, "property") === "og:image",
  )?.[0];
  const ogImageAltTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find(
    ([tag]) => attribute(tag, "property") === "og:image:alt",
  )?.[0];
  const ogImage = ogImageTag && attribute(ogImageTag, "content");
  const ogImageAlt = ogImageAltTag && attribute(ogImageAltTag, "content");
  check(Boolean(ogImage), `${page}: missing og:image`);
  check(Boolean(ogImageAlt?.trim()), `${page}: missing og:image:alt`);
  if (ogImage) {
    const url = new URL(ogImage);
    check(url.origin === SITE_ORIGIN, `${page}: og:image must be same-origin`);
    check(await targetExists(url.pathname), `${page}: missing og:image target ${url.pathname}`);
  }
}

const notFound = await readFile(join(distDir, "404.html"), "utf8");
const robotsTag = [...notFound.matchAll(/<meta\b[^>]*>/gi)].find(
  ([tag]) => attribute(tag, "name")?.toLowerCase() === "robots",
)?.[0];
const robots = robotsTag && attribute(robotsTag, "content");
check(robots?.split(/[\s,]+/).includes("noindex"), "404 page must be noindex");

const notFoundSection = [...notFound.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)].find(
  ([section]) =>
    attribute(section.slice(0, section.indexOf(">") + 1), "class")
      ?.split(/\s+/)
      .includes("not-found"),
)?.[0];
check(Boolean(notFoundSection), "404 page recovery section is missing");
if (notFoundSection) {
  const recoveryTargets = new Set(
    [...notFoundSection.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attribute(tag, "href")),
  );
  for (const target of ["/", "/posts/", "/projects/"]) {
    check(recoveryTargets.has(target), `404 page is missing recovery link ${target}`);
  }
}

const tagPages = htmlFiles.filter((file) => /\/tags\/[^/]+\/index\.html$/.test(file));
check(tagPages.length > 0, "no tag detail pages were generated");
for (const file of tagPages) {
  const page = `/${relative(distDir, file)}`;
  const html = await readFile(file, "utf8");
  const postCount = (html.match(/<h2\b/gi) ?? []).length;
  const summaryCount = Number(html.match(/\b(\d+)\s+posts?\b/i)?.[1]);
  const links = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attribute(tag, "href"));
  check(summaryCount === postCount, `${page}: tag summary must match its post-card count`);
  check(links.includes("/tags/"), `${page}: all-tags backlink is missing`);
  check(postCount > 0, `${page}: post cards must start at h2`);
}

const headers = await readFile(join(distDir, "_headers"), "utf8");
const globalHeaders = headers.match(/^\/\*\r?\n((?:[ \t]+[^\r\n]*(?:\r?\n|$))*)/m)?.[1];
const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
const scriptSrc = csp
  ?.split(";")
  .map((directive) => directive.trim())
  .find((directive) => directive.startsWith("script-src "));
check(Boolean(csp), "_headers is missing Content-Security-Policy");
const hasNoTransform = (value) =>
  value.split(",").some((directive) => directive.trim() === "no-transform");
check(
  hasNoTransform(globalHeaders?.match(/^\s*Cache-Control:\s*(.+)$/m)?.[1] ?? ""),
  "global headers must prevent Cloudflare from injecting CSP-incompatible scripts",
);
// `! Cache-Control` detaches the global value, so every rule must restate no-transform.
for (const [, value] of headers.matchAll(/^\s*Cache-Control:\s*(.+)$/gm)) {
  check(hasNoTransform(value), `Cache-Control "${value.trim()}" must include no-transform`);
}
check(scriptSrc === "script-src 'self'", "CSP must allow only same-origin executable scripts");
check(!scriptSrc?.includes("sha256-"), "CSP must not rely on hand-maintained script hashes");

const siteOg = await readFile(join(distDir, "og/site.png"));
check(siteOg.readUInt32BE(16) === 1200, "default OG image must be 1200 px wide");
check(siteOg.readUInt32BE(20) === 630, "default OG image must be 630 px tall");

if (failures.length > 0) {
  console.error(`Build verification failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlFiles.length} HTML pages and ${tagPages.length} tag pages in dist.`);
}

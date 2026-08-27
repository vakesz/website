import { getCollection, type CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;
type Project = CollectionEntry<"projects">;

interface YearGroup {
  readonly year: number;
  readonly posts: readonly Post[];
}

interface TagGroup {
  readonly slug: string;
  readonly label: string;
  readonly posts: readonly Post[];
}

interface PostCatalog {
  readonly posts: readonly Post[];
  readonly years: readonly YearGroup[];
  readonly tags: readonly TagGroup[];
  neighborsOf(id: string): Readonly<{ prev?: Post; next?: Post }>;
}

const buildTime = new Date();

function isVisiblePost({ data }: Post): boolean {
  if (!import.meta.env.PROD) return true;
  return !data.draft && data.pubDate <= buildTime;
}

function byPubDateDesc(a: Post, b: Post): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

function byPinnedThenOrder(a: Project, b: Project): number {
  if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
  return a.data.order - b.data.order;
}

export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

function groupPostsByYear(posts: readonly Post[]): readonly YearGroup[] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    const entries = groups.get(year) ?? [];
    entries.push(post);
    groups.set(year, entries);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, entries]) => ({ year, posts: entries }));
}

function groupPostsByTag(posts: readonly Post[]): readonly TagGroup[] {
  const groups = new Map<string, { slug: string; label: string; posts: Post[] }>();

  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = tagSlug(label);
      const group = groups.get(slug);
      if (group && group.label !== label) {
        throw new Error(`Tags "${group.label}" and "${label}" share the slug "${slug}".`);
      }
      if (group) {
        group.posts.push(post);
      } else {
        groups.set(slug, { slug, label, posts: [post] });
      }
    }
  }

  return [...groups.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label),
  );
}

export async function loadPostCatalog(): Promise<PostCatalog> {
  const posts = (await getCollection("posts", isVisiblePost)).sort(byPubDateDesc);
  const neighbors = new Map<string, { prev?: Post; next?: Post }>();

  posts.forEach((post, index) => {
    // Posts are newest-first, so the newer ("next") post has the lower index.
    neighbors.set(post.id, { next: posts[index - 1], prev: posts[index + 1] });
  });

  return {
    posts,
    years: groupPostsByYear(posts),
    tags: groupPostsByTag(posts),
    neighborsOf: (id) => neighbors.get(id) ?? {},
  };
}

export async function loadProjects(): Promise<readonly Project[]> {
  return (await getCollection("projects")).sort(byPinnedThenOrder);
}

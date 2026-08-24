export const SITE = {
  title: "vakesz.com",
  description:
    "Software engineer at Sigma Technology. Backend systems, developer tooling, and occasionally things with wheels.",
  author: "Gábor Pinkova",
  jobTitle: "Software Engineer",
  employer: "Sigma Technology",
  employerUrl: "https://sigmatechnology.com",
  locale: "en_US",
  email: "hello@vakesz.com",
} as const;

export const HTML_LANG = SITE.locale.replace("_", "-").toLowerCase();

export const NAV = [
  { href: "/posts/", label: "Posts" },
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About" },
] as const;

export const SOCIAL = {
  github: "https://github.com/vakesz",
  twitter: "https://twitter.com/vakeszqe",
  linkedin: "https://linkedin.com/in/gabor-pinkova",
  instagram: "https://instagram.com/vakeszqe",
  youtube: "https://youtube.com/@vakeszqe",
} as const;

export const TWITTER_HANDLE = "@vakeszqe";

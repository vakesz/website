type Theme = "light" | "dark";

export {};

const STORAGE_KEY = "theme";
const TOGGLE_ID = "theme-toggle";
const THEME_COLOR = { light: "#fcfcfc", dark: "#141718" } as const;

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function syncChrome(theme: Theme) {
  const button = document.getElementById(TOGGLE_ID);
  if (button) {
    const dark = theme === "dark";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
    el.setAttribute("content", THEME_COLOR[theme]);
  });
}

const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

function systemTheme(): Theme {
  return systemQuery.matches ? "dark" : "light";
}

function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  syncChrome(theme);
}

// Picking the theme the system already uses clears the override, so the
// site follows the system again from then on.
function chooseTheme(theme: Theme) {
  setTheme(theme);
  try {
    if (theme === systemTheme()) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // private mode / sandboxed
  }
}

function setup() {
  syncChrome(currentTheme());
  // Follow live system changes (e.g. automatic dark mode at sunset) unless overridden.
  systemQuery.addEventListener("change", () => {
    if (!savedTheme()) setTheme(systemTheme());
  });
  const button = document.getElementById(TOGGLE_ID);
  button?.addEventListener("click", () => {
    chooseTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

setup();

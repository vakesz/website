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

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  syncChrome(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // private mode / sandboxed
  }
}

function setup() {
  const button = document.getElementById(TOGGLE_ID);
  if (!button) return;
  syncChrome(currentTheme());
  button.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

setup();

(function () {
  // Select the color theme before first paint, ahead of the bundled scripts.
  try {
    const saved = localStorage.getItem("theme");
    const savedTheme = saved === "light" || saved === "dark" ? saved : null;
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();

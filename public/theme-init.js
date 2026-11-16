(function () {
  // Select the color theme before first paint, ahead of the bundled scripts.
  // A saved choice wins; otherwise follow the system setting.
  var prefersDark = false;
  try {
    prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {}
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {}
  var theme = saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();

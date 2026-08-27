(function () {
  // Record JavaScript availability before content paints, then select the
  // initial color theme without waiting for the bundled runtime scripts.
  document.documentElement.classList.add("js");
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

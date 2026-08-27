const MOBILE_QUERY = "(max-width: 720px)";

export {};

function bindNav() {
  const btn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("drawer-close");
  const nav = document.getElementById("primary-nav");
  const scrim = document.querySelector<HTMLElement>(".nav-scrim");
  if (!btn || !nav) return;

  const background = Array.from(document.body.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element !== nav && element !== scrim,
  );

  let lastFocused: HTMLElement | null = null;
  const isOpen = () => btn.getAttribute("aria-expanded") === "true";
  const focusables = () =>
    Array.from(nav.querySelectorAll<HTMLElement>("button, a[href]")).filter(
      (el) => !el.hasAttribute("disabled"),
    );

  const setToggleLabel = (open: boolean) => {
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  const setBackgroundInert = (inert: boolean) => {
    background.forEach((element) => {
      element.inert = inert;
    });
  };

  const close = () => {
    if (!isOpen()) return;
    btn.setAttribute("aria-expanded", "false");
    nav.setAttribute("data-open", "false");
    scrim?.setAttribute("data-open", "false");
    document.documentElement.removeAttribute("data-nav-open");
    setBackgroundInert(false);
    setToggleLabel(false);
    lastFocused?.focus();
    nav.setAttribute("aria-hidden", "true");
    lastFocused = null;
  };
  const open = () => {
    lastFocused = document.activeElement as HTMLElement | null;
    btn.setAttribute("aria-expanded", "true");
    nav.setAttribute("data-open", "true");
    nav.setAttribute("aria-hidden", "false");
    scrim?.setAttribute("data-open", "true");
    document.documentElement.setAttribute("data-nav-open", "");
    setBackgroundInert(true);
    setToggleLabel(true);
    (closeBtn ?? focusables()[0])?.focus();
  };
  const toggle = () => (isOpen() ? close() : open());

  btn.addEventListener("click", toggle);
  closeBtn?.addEventListener("click", close);
  scrim?.addEventListener("click", close);

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.closest("a")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    } else if (active instanceof Node && !nav.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  });

  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", () => {
    if (!mq.matches) close();
  });
}

bindNav();

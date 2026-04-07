export function initNav() {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector("[data-site-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");

  if (!nav) return;

  const page = document.body.dataset.page;
  if (page !== "home") {
    nav.classList.add("is-static");
    header?.classList.add("is-static");
  }

  const onScroll = () => {
    if (window.scrollY > 36) {
      nav.classList.add("is-scrolled");
      header?.classList.add("is-scrolled");
    } else if (page === "home") {
      nav.classList.remove("is-scrolled");
      header?.classList.remove("is-scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!toggle || !drawer) return;

  const setDrawer = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
    document.body.classList.toggle("drawer-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setDrawer(open);
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setDrawer(false));
  });

  document.addEventListener("click", (event) => {
    if (
      drawer.classList.contains("is-open") &&
      !drawer.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      setDrawer(false);
    }
  });
}

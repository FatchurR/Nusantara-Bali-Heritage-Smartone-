(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Page enter
  const root = document.querySelector("[data-page]");
  if (root) requestAnimationFrame(() => root.classList.add("is-ready"));

  // Smooth page leave transitions for internal links
  function isInternalLink(a){
    if (!a || !a.getAttribute) return false;
    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#")) return false;
    if (href.startsWith("http")) return false;
    if (href.startsWith("mailto:")) return false;
    return true;
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    if (!isInternalLink(a)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // If reduced motion, don't animate
    if (prefersReducedMotion || !root) return;

    e.preventDefault();
    root.classList.remove("is-ready");
    const href = a.getAttribute("href");

    setTimeout(() => {
      window.location.href = href;
    }, 260);
  });

  // Active nav highlight (optional)
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-active]").forEach(el => {
    el.classList.toggle("text-gold", el.getAttribute("data-active") === path);
  });
})();

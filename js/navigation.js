// navigation.js
// Header scroll behaviour + accessible mobile menu.

function trapFocus(container, e) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  /* ---- Header hide-on-scroll ---- */
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
      if (y > lastY && y > 140 && !mobileMenu?.classList.contains("is-open")) {
        header.classList.add("is-hidden");
      } else {
        header.classList.remove("is-hidden");
      }
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  /* ---- Mobile menu ---- */
  if (!toggle || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    const firstLink = mobileMenu.querySelector("a");
    firstLink?.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    toggle.focus();
  }

  toggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (!mobileMenu.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      closeMenu();
    } else if (e.key === "Tab") {
      trapFocus(mobileMenu, e);
    }
  });
}

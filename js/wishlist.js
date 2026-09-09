// wishlist.js
// Simple wishlist feature persisted to localStorage.
import { showToast } from "./main.js";
import { getProductById } from "./products.js";

const WISHLIST_KEY = "adaeze_atelier_wishlist";

function readWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read wishlist from storage", err);
    return [];
  }
}

function writeWishlist(ids) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn("Could not save wishlist to storage", err);
  }
}

let wishlistIds = readWishlist();

export function isWishlisted(id) {
  return wishlistIds.includes(id);
}

export function getWishlistIds() {
  return wishlistIds;
}

function updateBadges() {
  document.querySelectorAll("[data-wishlist-count]").forEach((b) => {
    b.textContent = String(wishlistIds.length);
    b.classList.toggle("is-visible", wishlistIds.length > 0);
  });
}

function syncButtons(id) {
  document
    .querySelectorAll(`.wishlist-btn[data-id="${id}"]`)
    .forEach((btn) => {
      const active = isWishlisted(id);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute(
        "aria-label",
        active ? "Remove from wishlist" : "Add to wishlist"
      );
    });
}

export function toggleWishlist(id) {
  const active = isWishlisted(id);
  if (active) {
    wishlistIds = wishlistIds.filter((i) => i !== id);
  } else {
    wishlistIds.push(id);
  }
  writeWishlist(wishlistIds);
  syncButtons(id);
  updateBadges();

  const product = getProductById(id);
  if (product) {
    showToast(
      active ? `Removed "${product.name}" from wishlist` : `Added "${product.name}" to wishlist`
    );
  }
}

export function initWishlist() {
  updateBadges();
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id) return;
    e.preventDefault();
    toggleWishlist(id);
  });

  // Sync all buttons currently in the DOM (e.g. after a re-render)
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    if (btn.dataset.id) syncButtons(btn.dataset.id);
  });
}

// Re-sync whenever new product cards are rendered dynamically.
export function refreshWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    if (btn.dataset.id) syncButtons(btn.dataset.id);
  });
}

// search.js
// Powers the Shop page: category filters, text search and sorting,
// all without a page reload.
import { products } from "./products.js";
import { renderProductGrid } from "./main.js";

const state = {
  category: "All",
  query: "",
  sort: "featured"
};

function applyFilters() {
  let list = products.slice();

  if (state.category !== "All") {
    list = list.filter(
      (p) => p.category === state.category || p.tag === state.category
    );
  }

  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (state.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // featured: keep source order
      break;
  }

  return list;
}

function render() {
  const grid = document.getElementById("shop-product-grid");
  const countEl = document.getElementById("shop-result-count");
  const emptyState = document.getElementById("shop-empty-state");
  const list = applyFilters();

  renderProductGrid(grid, list);

  if (countEl) {
    countEl.textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
  }
  if (emptyState) {
    emptyState.classList.toggle("is-visible", list.length === 0);
  }
}

export function initShopPage() {
  const grid = document.getElementById("shop-product-grid");
  if (!grid) return; // Not on the shop page

  const chips = document.querySelectorAll(".filter-row .chip");
  const searchInput = document.getElementById("shop-search-input");
  const sortSelect = document.getElementById("shop-sort-select");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      state.category = chip.dataset.category;
      render();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  sortSelect?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  // Support ?category= and ?q= deep links from the homepage.
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category");
  const initialQuery = params.get("q");
  if (initialCategory) {
    state.category = initialCategory;
    const matchingChip = document.querySelector(
      `.chip[data-category="${CSS.escape(initialCategory)}"]`
    );
    if (matchingChip) {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      matchingChip.setAttribute("aria-pressed", "true");
    }
  }
  if (initialQuery && searchInput) {
    state.query = initialQuery;
    searchInput.value = initialQuery;
  }

  render();
}

document.addEventListener("DOMContentLoaded", initShopPage);

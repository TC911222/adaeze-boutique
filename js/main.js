// main.js
// Toast notifications, scroll reveal, quick-view modal, and shared product
// card markup. Also boots every other module.
import { products, getProductById, formatNaira } from "./products.js";
import { initNavigation } from "./navigation.js";
import { initCart, addToCart } from "./cart.js";
import { initWishlist, isWishlisted } from "./wishlist.js";

/* -------------------------- Toast -------------------------- */
let toastTimer = null;

export function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/* -------------------------- Scroll reveal -------------------------- */
export function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal:not(.is-observed)");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((i) => i.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  items.forEach((item) => {
    item.classList.add("is-observed");
    observer.observe(item);
  });
}

/* -------------------------- Product card markup -------------------------- */
export function productCardHTML(product) {
  const active = isWishlisted(product.id);
  return `
    <article class="product-card reveal" data-id="${product.id}" data-category="${product.category}" data-tag="${product.tag}">
      <div class="product-media">
        <button type="button" class="wishlist-btn${active ? " is-active" : ""}" data-id="${product.id}" aria-pressed="${active}" aria-label="${active ? "Remove from wishlist" : "Add to wishlist"}">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.1C.4 8.6 2 5 5.6 5c2 0 3.4 1 4.4 2.6C11 6 12.4 5 14.4 5 18 5 19.6 8.6 22 11.9 19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <img src="${product.image}" alt="${product.name}, ${product.category}" loading="lazy" width="600" height="800">
        <button type="button" class="quickview-btn" data-quickview="${product.id}">Quick view</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatNaira(product.price)}</p>
      </div>
    </article>
  `;
}

export function renderProductGrid(container, list) {
  if (!container) return;
  container.innerHTML = list.map(productCardHTML).join("");
  initReveal(container);
}

/* -------------------------- Quick view modal -------------------------- */
function buildModal() {
  if (document.getElementById("quickview-modal")) return;
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "quickview-modal";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="qv-title">
      <button type="button" class="modal-close" data-close-modal aria-label="Close quick view">✕</button>
      <div class="modal-media">
        <img id="qv-image" src="" alt="">
      </div>
      <div class="modal-body">
        <p class="product-category" id="qv-category"></p>
        <h3 id="qv-title"></h3>
        <p class="price" id="qv-price"></p>
        <p class="modal-desc" id="qv-desc"></p>
        <div class="qty-row">
          <span>Quantity</span>
          <div class="qty-stepper" role="group" aria-label="Quantity">
            <button type="button" id="qv-dec" aria-label="Decrease quantity">−</button>
            <span id="qv-qty" aria-live="polite">1</span>
            <button type="button" id="qv-inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" id="qv-add">Add to cart</button>
          <button type="button" class="btn btn-outline wishlist-btn" id="qv-wishlist" data-id="">Save for later</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

let qvQty = 1;
let qvCurrentId = null;

export function openQuickView(id) {
  const product = getProductById(id);
  if (!product) return;
  buildModal();

  const overlay = document.getElementById("quickview-modal");
  qvQty = 1;
  qvCurrentId = id;

  overlay.querySelector("#qv-image").src = product.image;
  overlay.querySelector("#qv-image").alt = product.name;
  overlay.querySelector("#qv-category").textContent = product.category;
  overlay.querySelector("#qv-title").textContent = product.name;
  overlay.querySelector("#qv-price").textContent = formatNaira(product.price);
  overlay.querySelector("#qv-desc").textContent = product.description;
  overlay.querySelector("#qv-qty").textContent = "1";
  const wishlistBtn = overlay.querySelector("#qv-wishlist");
  wishlistBtn.dataset.id = product.id;
  wishlistBtn.classList.toggle("is-active", isWishlisted(product.id));

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  overlay.querySelector(".modal-close").focus();
}

function closeQuickView() {
  const overlay = document.getElementById("quickview-modal");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function initQuickView() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-quickview]");
    if (trigger) {
      openQuickView(trigger.dataset.quickview);
      return;
    }
    if (e.target.closest("[data-close-modal]")) {
      closeQuickView();
      return;
    }
    if (e.target.id === "quickview-modal") {
      closeQuickView();
      return;
    }
    if (e.target.id === "qv-inc") {
      qvQty += 1;
      document.getElementById("qv-qty").textContent = String(qvQty);
      return;
    }
    if (e.target.id === "qv-dec") {
      qvQty = Math.max(1, qvQty - 1);
      document.getElementById("qv-qty").textContent = String(qvQty);
      return;
    }
    if (e.target.id === "qv-add") {
      if (qvCurrentId) addToCart(qvCurrentId, qvQty);
      closeQuickView();
      return;
    }
  });

  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("quickview-modal");
    if (e.key === "Escape" && overlay?.classList.contains("is-open")) {
      closeQuickView();
    }
  });
}

/* -------------------------- Init -------------------------- */
function initFeaturedProducts() {
  const grid = document.getElementById("featured-product-grid");
  if (!grid) return;
  const featured = products.slice(0, 8);
  renderProductGrid(grid, featured);
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCart();
  initWishlist();
  initQuickView();
  initFeaturedProducts();
  initReveal();
  initYear();
});

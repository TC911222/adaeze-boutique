// cart.js
// Frontend shopping cart with localStorage persistence and WhatsApp ordering.
import { getProductById, formatNaira } from "./products.js";
import { showToast } from "./main.js";

const CART_KEY = "adaeze_atelier_cart";
const WHATSAPP_NUMBER = "2340000000000"; // TODO: replace with the boutique's real WhatsApp number (international format, no +)

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read cart from storage", err);
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("Could not save cart to storage", err);
  }
}

let cartItems = readCart();
const listeners = new Set();

function notify() {
  writeCart(cartItems);
  listeners.forEach((fn) => fn(cartItems));
  renderCart();
}

export function onCartChange(fn) {
  listeners.add(fn);
}

export function getCartItems() {
  return cartItems;
}

export function getCartCount() {
  return cartItems.reduce((sum, i) => sum + i.qty, 0);
}

export function getCartSubtotal() {
  return cartItems.reduce((sum, i) => {
    const p = getProductById(i.id);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
}

export function addToCart(id, qty = 1) {
  const existing = cartItems.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cartItems.push({ id, qty });
  }
  notify();
  const product = getProductById(id);
  if (product) showToast(`Added "${product.name}" to cart`);
}

export function removeFromCart(id) {
  cartItems = cartItems.filter((i) => i.id !== id);
  notify();
}

export function updateQty(id, qty) {
  const item = cartItems.find((i) => i.id === id);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  item.qty = qty;
  notify();
}

export function clearCart() {
  cartItems = [];
  notify();
}

/* -------------------------- UI wiring -------------------------- */

function el(id) {
  return document.getElementById(id);
}

function renderCart() {
  const list = el("cart-items");
  const emptyMsg = el("cart-empty-msg");
  const subtotalEl = el("cart-subtotal-value");
  const countBadges = document.querySelectorAll("[data-cart-count]");
  const checkoutBtn = el("cart-whatsapp-btn");

  const count = getCartCount();
  countBadges.forEach((b) => {
    b.textContent = String(count);
    b.classList.toggle("is-visible", count > 0);
  });

  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = "";
    if (emptyMsg) emptyMsg.style.display = "block";
    if (subtotalEl) subtotalEl.textContent = formatNaira(0);
    if (checkoutBtn) checkoutBtn.setAttribute("disabled", "true");
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";
  if (checkoutBtn) checkoutBtn.removeAttribute("disabled");

  list.innerHTML = cartItems
    .map((item) => {
      const p = getProductById(item.id);
      if (!p) return "";
      return `
        <li class="cart-item" data-id="${p.id}">
          <img src="${p.image}" alt="" loading="lazy" width="72" height="90">
          <div>
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-meta">${p.category} · ${formatNaira(p.price)}</p>
            <div class="cart-item-controls">
              <div class="qty-stepper" role="group" aria-label="Quantity for ${p.name}">
                <button type="button" data-action="dec" aria-label="Decrease quantity">−</button>
                <span aria-live="polite">${item.qty}</span>
                <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="cart-item-remove" data-action="remove">Remove</button>
            </div>
          </div>
          <p class="cart-item-meta" style="text-align:right; font-weight:600;">${formatNaira(p.price * item.qty)}</p>
        </li>
      `;
    })
    .join("");

  if (subtotalEl) subtotalEl.textContent = formatNaira(getCartSubtotal());
}

function buildWhatsAppMessage() {
  const lines = ["Hello Adaeze Atelier, I'd like to place an order:", ""];
  cartItems.forEach((item) => {
    const p = getProductById(item.id);
    if (!p) return;
    lines.push(`• ${p.name} (x${item.qty}) — ${formatNaira(p.price * item.qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${formatNaira(getCartSubtotal())}`);
  lines.push("");
  lines.push("Please could you confirm availability and delivery to Awka / shipping options?");
  return lines.join("\n");
}

export function initCart() {
  const drawer = el("cart-drawer");
  const scrim = el("drawer-scrim");
  const openBtns = document.querySelectorAll("[data-open-cart]");
  const closeBtns = document.querySelectorAll("[data-close-cart]");
  const list = el("cart-items");
  const checkoutBtn = el("cart-whatsapp-btn");
  const clearBtn = el("cart-clear-btn");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    scrim?.classList.add("is-open");
    document.body.classList.add("no-scroll");
    drawer.setAttribute("aria-hidden", "false");
    const closeBtn = drawer.querySelector(".modal-close, [data-close-cart]");
    closeBtn?.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    scrim?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    drawer.setAttribute("aria-hidden", "true");
  }

  openBtns.forEach((btn) => btn.addEventListener("click", openDrawer));
  closeBtns.forEach((btn) => btn.addEventListener("click", closeDrawer));
  scrim?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  list?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const li = btn.closest(".cart-item");
    const id = li?.dataset.id;
    if (!id) return;
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (btn.dataset.action === "inc") updateQty(id, item.qty + 1);
    if (btn.dataset.action === "dec") updateQty(id, item.qty - 1);
    if (btn.dataset.action === "remove") removeFromCart(id);
  });

  clearBtn?.addEventListener("click", () => {
    clearCart();
    showToast("Cart cleared");
  });

  checkoutBtn?.addEventListener("click", () => {
    if (cartItems.length === 0) return;
    const message = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank", "noopener");
  });

  window.__openCartDrawer = openDrawer;

  renderCart();
}

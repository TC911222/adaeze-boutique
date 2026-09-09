# Adaeze Atelier — Boutique Website

A premium boutique fashion website for a fictional brand based in Awka,
Anambra State, Nigeria. Built with plain HTML5, modern CSS3, and vanilla
JavaScript (ES modules) — no frameworks, no build step, no dependencies.

## Running it

No build tools are required. Because the JavaScript uses ES modules
(`import`/`export`), open the site through a local server rather than the
`file://` protocol (browsers block module imports over `file://`).

From inside the `boutique/` folder, run one of:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000`.

## Structure

```
boutique/
├── index.html          Home
├── shop.html            Shop (filters, search, sort)
├── about.html            About / brand story
├── journal.html           Journal (editorial articles)
├── contact.html            Contact form + boutique details
├── css/
│   └── style.css        All styles, driven by CSS custom properties
├── js/
│   ├── main.js           Toast, scroll reveal, quick-view modal, boot
│   ├── products.js        Product data (edit this to add/remove products)
│   ├── cart.js             Cart state, localStorage, WhatsApp ordering
│   ├── wishlist.js          Wishlist state + localStorage
│   ├── search.js            Shop page filter/search/sort logic
│   └── contact.js           Contact form validation
└── README.md
```

## Before launching for real

This is a portfolio / demo build. A few things are intentionally left as
placeholders and should be replaced with real details before going live:

- **Phone, email, WhatsApp number, and Instagram handle** — search for
  `2340000000000`, `hello@adaezeatelier.example`, and `@adaezeatelier`
  across the HTML/JS files and swap in the real details. The WhatsApp
  number used for ordering lives in `js/cart.js` (`WHATSAPP_NUMBER`).
- **Contact form** — `js/contact.js` only validates the form and shows a
  confirmation message; there is no backend wired up to actually send the
  message. Connect it to a form endpoint, serverless function, or backend
  of your choice.
- **Product images** — placeholder photography is pulled from Unsplash.
  Replace `image` URLs in `js/products.js` with real product photography
  before launch (and consider serving local, optimized `.webp` files from
  `assets/images/`).
- **Structured data** — the `LocalBusiness`/`ClothingStore` JSON-LD blocks
  in `index.html` and `contact.html` use a placeholder address and phone
  number; update them with the real values.

## Notable features

- Cart and wishlist persist via `localStorage` and survive page reloads.
- "Order via WhatsApp" builds a pre-filled WhatsApp message from the cart
  contents — no online payment is implemented, by design.
- Shop page filters, searches, and sorts without a page reload.
- Mobile menu and quick-view/cart modals are keyboard accessible: they
  trap focus, close on <kbd>Escape</kbd>, and restore scroll when closed.
- Respects `prefers-reduced-motion`.

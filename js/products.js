// products.js
// Central product data. Add or remove entries here to update the shop.
// Prices are illustrative (₦) and not real retail prices.

export const products = [
  {
    id: "dress-linen-midi",
    name: "Adaora Linen Midi Dress",
    category: "Women's",
    tag: "New Arrivals",
    price: 85000,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
    description: "A relaxed midi cut in heavyweight linen, finished with a self-tie waist and mother-of-pearl buttons. Cut to move with you through Awka's warmest afternoons."
  },
  {
    id: "blazer-tailored-olive",
    name: "Nkechi Tailored Blazer",
    category: "Women's",
    tag: "Signature Pieces",
    price: 124000,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&auto=format&fit=crop",
    description: "Structured shoulders, a nipped waist, and a single gold-tone button. Built on our house block and cut from a soft olive wool-blend."
  },
  {
    id: "shirt-oxford-cream",
    name: "Emeka Oxford Shirt",
    category: "Men's",
    tag: "Signature Pieces",
    price: 58000,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80&auto=format&fit=crop",
    description: "A crisp cream oxford with a two-button barrel cuff and mother-of-pearl buttons. Wears equally well under a blazer or rolled to the elbow."
  },
  {
    id: "trouser-wool-charcoal",
    name: "Obinna Wide-Leg Trouser",
    category: "Men's",
    tag: "New Arrivals",
    price: 76000,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80&auto=format&fit=crop",
    description: "A fluid wide leg in brushed charcoal wool, pleated at the front for ease. Sits at the natural waist with a concealed hook closure."
  },
  {
    id: "bag-leather-tote",
    name: "Ijeoma Leather Tote",
    category: "Accessories",
    tag: "Signature Pieces",
    price: 96000,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80&auto=format&fit=crop",
    description: "Vegetable-tanned leather that deepens in colour with wear, structured around a solid brass frame and hand-stitched gussets."
  },
  {
    id: "earrings-gold-hoop",
    name: "Chidinma Hoop Earrings",
    category: "Accessories",
    tag: "New Arrivals",
    price: 32000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=80&auto=format&fit=crop",
    description: "Brushed gold-plated hoops with a hammered finish, light enough for all-day wear and substantial enough to notice."
  },
  {
    id: "dress-wrap-evening",
    name: "Amarachi Wrap Dress",
    category: "Women's",
    tag: "Signature Pieces",
    price: 138000,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=80&auto=format&fit=crop",
    description: "A fluid silk-blend wrap dress that falls just below the knee, cut on the bias for a drape that moves with every step."
  },
  {
    id: "sneaker-leather-white",
    name: "Uzo Court Sneaker",
    category: "Men's",
    tag: "New Arrivals",
    price: 68000,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80&auto=format&fit=crop",
    description: "A clean leather court sneaker with a low profile sole and a soft suede heel tab. Designed to pair as easily with trousers as denim."
  },
  {
    id: "scarf-silk-print",
    name: "Ngozi Silk Scarf",
    category: "Accessories",
    tag: "New Arrivals",
    price: 41000,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&q=80&auto=format&fit=crop",
    description: "Hand-rolled edges on a lightweight silk twill, printed with an abstract motif drawn from traditional uli line work."
  },
  {
    id: "jacket-denim-relaxed",
    name: "Chukwuemeka Denim Jacket",
    category: "Men's",
    tag: "New Arrivals",
    price: 79000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80&auto=format&fit=crop",
    description: "Rigid Japanese denim, washed once and left to soften naturally. Cut with a slightly boxy body and dropped shoulder."
  },
  {
    id: "trench-cotton-camel",
    name: "Adaeze Signature Trench",
    category: "Women's",
    tag: "Signature Pieces",
    price: 165000,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80&auto=format&fit=crop",
    description: "Our house trench in a dense camel cotton gabardine, with a storm flap, belted waist, and hand-finished topstitching throughout."
  },
  {
    id: "sandal-leather-strap",
    name: "Uchechi Strap Sandal",
    category: "Accessories",
    tag: "Women's",
    price: 47000,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80&auto=format&fit=crop",
    description: "Slim leather straps on a low stacked heel, built for long days that start on tarred road and end on red earth."
  }
];

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function formatNaira(amount) {
  return "₦" + amount.toLocaleString("en-NG");
}

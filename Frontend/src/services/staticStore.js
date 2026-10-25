const STATIC_ADDRESS_KEY = "staticHomepageAddresses";
const STATIC_ORDER_KEY = "staticHomepageOrders";

export const STATIC_PRODUCTS = [
  { id: "linen-shirt", title: "Classic Linen Shirt", description: "A light, everyday shirt with a relaxed tailored fit.", price: 1200, category: "T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80", rating: 4.8, stock: 12, badge: "New" },
  { id: "canvas-tote", title: "Everyday Canvas Tote", description: "A roomy carryall for workdays, markets, and weekends.", price: 850, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", rating: 4.7, stock: 8, badge: "Popular" },
  { id: "ceramic-mug", title: "Handcrafted Ceramic Mug", description: "A warm, textured mug made for slow morning coffee.", price: 650, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80", rating: 4.9, stock: 18, badge: "New" },
  { id: "minimal-watch", title: "Minimal Everyday Watch", description: "Clean lines and a comfortable strap for every day.", price: 2200, category: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80", rating: 4.6, stock: 5, badge: "Limited" },
  { id: "desk-lamp", title: "Soft Glow Desk Lamp", description: "A compact lamp that brings calm light to your workspace.", price: 1650, category: "Home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", rating: 4.7, stock: 7, badge: "New" },
  { id: "running-shoes", title: "Cloud Step Sneakers", description: "Comfortable, lightweight sneakers for daily movement.", price: 2800, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", rating: 4.8, stock: 10, badge: "Popular" },
];

export const STATIC_CATEGORIES = [
  { name: "T-Shirt", image: STATIC_PRODUCTS[0].image },
  { name: "Accessories", image: STATIC_PRODUCTS[1].image },
  { name: "Home", image: STATIC_PRODUCTS[2].image },
  { name: "Footwear", image: STATIC_PRODUCTS[5].image },
];

export const getStaticProduct = (id) => STATIC_PRODUCTS.find((product) => product.id === id) || null;

export function isStaticProductId(id) {
  return typeof id === "string" && id.startsWith("static-");
}

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export const getStaticAddresses = () => read(STATIC_ADDRESS_KEY);

export function addStaticAddress(address) {
  const savedAddress = { ...address, _id: `static-address-${Date.now()}` };
  return write(STATIC_ADDRESS_KEY, [...getStaticAddresses(), savedAddress]);
}

export function getStaticOrders() {
  return read(STATIC_ORDER_KEY).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function createStaticOrder({ items, address, total }) {
  const order = {
    _id: `static-order-${Date.now()}`,
    items,
    address,
    totalAmount: total,
    paymentMethod: "COD",
    status: "Placed",
    createdAt: new Date().toISOString(),
  };
  write(STATIC_ORDER_KEY, [...read(STATIC_ORDER_KEY), order]);
  return order;
}
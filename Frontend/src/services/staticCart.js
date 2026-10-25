const STATIC_CART_KEY = "staticHomepageCart";

export function getStaticCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(STATIC_CART_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function getStaticCartCount() {
  return getStaticCartItems().reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function saveStaticCart(items) {
  localStorage.setItem(STATIC_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("staticCartUpdated", { detail: { items } }));
  return items;
}

export function addStaticCartItem(product) {
  const items = getStaticCartItems();
  const existingItem = items.find((item) => item.id === product.id);
  const nextItems = existingItem
    ? items.map((item) => item.id === product.id ? { ...item, quantity: Math.min(Number(item.quantity || 0) + 1, Number(product.stock || 99)) } : item)
    : [...items, { ...product, quantity: 1, isStatic: true }];
  return saveStaticCart(nextItems);
}

export function updateStaticCartItem(productId, quantity) {
  const nextItems = quantity < 1
    ? getStaticCartItems().filter((item) => item.id !== productId)
    : getStaticCartItems().map((item) => item.id === productId ? { ...item, quantity: Math.min(quantity, Number(item.stock || 99)) } : item);
  return saveStaticCart(nextItems);
}

export function removeStaticCartItem(productId) {
  return saveStaticCart(getStaticCartItems().filter((item) => item.id !== productId));
}

export function clearStaticCart() {
  return saveStaticCart([]);
}
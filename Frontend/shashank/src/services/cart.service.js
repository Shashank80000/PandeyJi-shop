import api from "./api";

export const cartService = {
  getMine() {
    return api.get("/cart");
  },

  add(payload) {
    return api.post("/cart", payload);
  },

  updateItem(productId, payload) {
    return api.patch(`/cart/${productId}`, payload);
  },

  removeItem(productId) {
    return api.delete(`/cart/${productId}`);
  },
};

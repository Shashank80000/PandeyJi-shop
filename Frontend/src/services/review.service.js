import api from "./api";

export const reviewService = {
  getByProduct(productId) {
    return api.get(`/reviews/product/${productId}`);
  },

  create(productId, payload) {
    return api.post(`/reviews/product/${productId}`, payload);
  },
};

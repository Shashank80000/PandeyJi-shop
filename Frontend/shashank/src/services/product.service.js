import api from "./api";

export const productService = {
  getAll() {
    return api.get("/products");
  },

  getById(id) {
    return api.get(`/products/${id}`);
  },

  create(payload) {
    return api.post("/products", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id, payload) {
    return api.put(`/products/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  remove(id) {
    return api.delete(`/products/${id}`);
  },
};

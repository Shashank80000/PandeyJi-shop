import api from "./api";

export const orderService = {
  create(payload) {
    return api.post("/orders", payload);
  },

  getMine() {
    return api.get("/orders/my-orders");
  },
};

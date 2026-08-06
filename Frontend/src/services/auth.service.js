import api from "./api";

export const authService = {
  signup(payload) {
    return api.post("/auth/signup", payload);
  },

  login(payload) {
    return api.post("/auth/login", payload);
  },
};

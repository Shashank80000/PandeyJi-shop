import api from "./api";

export const categoryService = {
  getAll() {
    return api.get("/categories");
  },
};

import express from "express";
import upload from "../middleware/upload.js";

import {
  getAllProducts,
  createProduct,
} from "../Controller/productController.js";

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Create product with images
router.post(
  "/create",
  upload.array("images", 5),
  createProduct
);

export default router;
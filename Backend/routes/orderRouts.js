import express from "express";
import {
    placeOrder,
    getAllOrders
} from "../Controller/orderController.js";

const router = express.Router();

// User places order
router.post("/place", placeOrder);

// Admin gets all orders
router.get("/all", getAllOrders);

export default router;

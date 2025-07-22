import express from "express";
import {
  addItemsToCart,
  removeItemsFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add a product to the cart
router.post("/:id", isAuthenticated, addItemsToCart);

// Remove a product (or reduce quantity) from the cart
router.delete("/:id", isAuthenticated, removeItemsFromCart);

// Clear the entire cart
router.delete("/clear", isAuthenticated, clearCart);


export default router;

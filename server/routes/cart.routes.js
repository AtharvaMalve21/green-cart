import express from "express";
import {
  addItemsToCart,
  getCartItems,
  viewCart,
  removeItemsFromCart,
  clearCart,
  updateCartItemQuantity,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Authenticated users only
router.get("/", isAuthenticated, getCartItems);
router.get("/view", isAuthenticated, viewCart);
router.delete("/:id", isAuthenticated, removeItemsFromCart);
router.put("/", isAuthenticated, updateCartItemQuantity);
router.delete("/clear", isAuthenticated, clearCart);
router.post("/:id", isAuthenticated, addItemsToCart);

export default router;

import express from "express";
import {
  placeOrderCOD,
  myOrders,
  placeOrderOnline,
} from "../controllers/order.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/cod", isAuthenticated, placeOrderCOD);
router.get("/", isAuthenticated, myOrders);
router.post("/online", isAuthenticated, placeOrderCOD);

export default router;

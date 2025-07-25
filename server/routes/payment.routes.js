import express from "express";
import {
  createPayment,
  verifyOrderPayment,
} from "../controllers/payment.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/order/:id", isAuthenticated, createPayment);
router.post("/verify", isAuthenticated, verifyOrderPayment);

export default router;

import express from "express";
import {
  addAddress,
  getAddress,
  viewAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, addAddress);
router.get("/", isAuthenticated, getAddress);
router.get("/:id", isAuthenticated, viewAddress);
router.put("/:id", isAuthenticated, updateAddress);
router.delete("/:id", isAuthenticated, deleteAddress);

export default router;

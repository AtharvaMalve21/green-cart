import express from "express";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  findAllProducts,
} from "../controllers/admin.controller.js";

import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

//Admin-Login
router.post("/login", adminLogin);

//Admin-Logout
router.get("/logout", isAdmin, adminLogout);

//Admin-Profile
router.get("/profile", isAdmin, getAdminProfile);

//Admin-Find All the Listed Products
router.get("/products", isAdmin, findAllProducts);

export default router;

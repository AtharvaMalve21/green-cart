import express from "express";
import {
  signup,
  login,
  logout,
  getUserProfile,
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

//User-Registration
router.post("/signup", signup);

//User-Login
router.post("/login", login);

//User-Logout
router.get("/logout", isAuthenticated, logout);

//User-Profile
router.get("/profile", isAuthenticated, getUserProfile);

export default router;

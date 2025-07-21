import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register or log in again.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {

    const { admintoken } = req.cookies;

    if (!admintoken) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin token missing.",
      });
    }

    const decodedToken = jwt.verify(admintoken, process.env.JWT_SECRET);

    req.admin = decodedToken.email;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin session expired. Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed.",
    });
  }
};

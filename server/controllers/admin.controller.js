import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const adminLogin = async (req, res) => {
  try {
    //fetch the admin details
    const { email, password } = req.body;

    //validate the details
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    //check email or password
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    //generate a admin token
    const adminToken = jwt.sign(
      { email: process.env.ADMIN_EMAIL },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("adminToken", adminToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin is logged in successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("adminToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin is successfully logged out.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const email = req.admin;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({
        success: false,
        message: "Admin is not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: email,
      message: "Admin details fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const findAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products data fetched.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    
    const orders = await Order.find({}).populate("orderItems.product address");

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders data fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

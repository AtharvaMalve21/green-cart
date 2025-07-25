import { razorpayInstance } from "../utils/razorpay.utils.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
import mongoose from "mongoose";

export const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const { id: orderId } = req.params;
    console.log(orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID.",
      });
    }

    const order = await Order.findById(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with the provided ID.",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "You have already paid for this order.",
      });
    }

    const options = {
      amount: order.totalAmount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: order._id.toString(),
    };

    const orderData = await razorpayInstance.orders.create(options);
    order.razorpayOrderId = orderData.id;
    await order.save();

    return res.status(200).json({
      success: true,
      data: {
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        _id: order._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyOrderPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log(
      "Received:",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    );

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Missing required fields.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with provided orderId.",
      });
    }

    order.paymentStatus = "Paid";
    order.paymentMethod = "Online";
    order.paymentInfo = {
      id: razorpay_payment_id,
      method: "Online",
    };
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order marked as paid.",
    });
  } catch (err) {
    console.error("Payment verification error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification.",
    });
  }
};

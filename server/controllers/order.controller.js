import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";
import { orderPlacedEmailTemplate } from "../utils/emailTemplate.js";
import transporter from "../config/nodemailer.config.js";
import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const { address, orderItems } = req.body;

    if (orderItems.length === 0 && !address) {
      return res.status(400).json({
        success: false,
        message: "Please add items to your cart and select a delivery address.",
      });
    } else if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Your cart is empty. Please add items before placing the order.",
      });
    } else if (!address) {
      return res.status(400).json({
        success: false,
        message: "Please select a delivery address to proceed with the order.",
      });
    }

    let amt = 0;
    const itemAmounts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found.");
        return product.offerPrice * item.quantity;
      })
    );

    amt = itemAmounts.reduce((sum, val) => sum + val, 0);
    amt += Math.floor(amt * 0.02); // 2% tax

    // Create the order
    const order = await Order.create({
      user: userId,
      orderItems,
      totalAmount: amt,
      address,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    await User.findByIdAndUpdate(
      userId,
      { $set: { cartItems: [] } },
      { new: true }
    );

    //find the address
    const userAddress = await Address.findById(address);

    const shippingAddress = {
      firstName: userAddress.firstName,
      lastName: userAddress.lastName,
      email: userAddress.email,
      street: userAddress.street,
      state: userAddress.state,
      zipcode: userAddress.zipcode,
      phone: userAddress.phone,
    };

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "🛒 Your Green-Cart Order Has Been Placed Successfully!",
      html: orderPlacedEmailTemplate(
        user.name,
        order._id.toString(),
        order.totalAmount,
        shippingAddress
      ),
    });

    return res.status(200).json({
      success: true,
      data: order._id,
      message: "Order Placed successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const myOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("address");

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders data fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const placeOrderOnline = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const { address, orderItems } = req.body;

    if (orderItems.length === 0 && !address) {
      return res.status(400).json({
        success: false,
        message: "Please add items to your cart and select a delivery address.",
      });
    } else if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Your cart is empty. Please add items before placing the order.",
      });
    } else if (!address) {
      return res.status(400).json({
        success: false,
        message: "Please select a delivery address to proceed with the order.",
      });
    }

    let amt = 0;
    const itemAmounts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found.");
        return product.offerPrice * item.quantity;
      })
    );

    amt = itemAmounts.reduce((sum, val) => sum + val, 0);
    amt += Math.floor(amt * 0.02); // 2% tax

    // Create the order
    const order = await Order.create({
      user: userId,
      orderItems,
      totalAmount: amt,
      address,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    await User.findByIdAndUpdate(
      userId,
      { $set: { cartItems: [] } },
      { new: true }
    );

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "🛒 Your Green-Cart Order Has Been Placed Successfully!",
      html: orderPlacedEmailTemplate(user.email, order._id, amt, address),
    });

    return res.status(200).json({
      success: true,
      data: order._id,
      message: "Order placed successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

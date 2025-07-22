import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const { quantity } = req.body;
    const { id: productId } = req.params;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cartItems.push({
        productId,
        quantity: quantity,
      });
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message: `${product.name} added to cart!`,
      cart: user.cartItems,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeItemsFromCart = async (req, res) => {
  try {
    // Authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get product ID from params
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Find product in user's cart
    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product not in cart.",
      });
    }

    // Decrease quantity or remove if quantity is 1
    if (user.cartItems[existingItemIndex].quantity > 1) {
      user.cartItems[existingItemIndex].quantity -= 1;
    } else {
      user.cartItems.splice(existingItemIndex, 1); // remove the item entirely
    }

    await user.save();

    return res.status(200).json({
      success: true,
      data: user.cartItems,
      message: `${product.name} removed from cart`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    // Authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // Clear the cart
    user.cartItems = [];
    await user.save();

    return res.status(200).json({
      success: true,
      data: user.cartItems,
      message: "Cart has been cleared successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

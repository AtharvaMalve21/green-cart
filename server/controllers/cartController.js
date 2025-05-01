const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Add Product to Cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const totalPrice = product.price * quantity;
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.price += totalPrice;
      } else {
        cart.products.push({ productId, quantity, price: totalPrice });
      }

      await cart.save();
    } else {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity, price: totalPrice }],
      });
    }

    await User.findByIdAndUpdate(userId, { cartItems: cart._id });

    return res.status(201).json({
      success: true,
      data: cart,
      message: "Item added to cart.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Cart Items for a User
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");

    return res.status(200).json({
      success: true,
      data: cart || [],
      message: "Cart items fetched.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// View a Specific Cart by ID
exports.viewCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      _id: id,
      userId,
    }).populate("products.productId");

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    return res.status(200).json({
      success: true,
      data: cartItem,
      message: "Cart item fetched.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Remove Specific Product from Cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    const originalLength = cart.products.length;

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.products.length === originalLength) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart." });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Entire Cart
exports.deleteCart = async (req, res) => {
    
  try {
    const userId = req.user._id;
    const { id: cartId } = req.params;

    const cart = await Cart.findById(cartId);
    if (!cart || cart.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or cart not found.",
      });
    }

    await Cart.findByIdAndDelete(cartId);
    await User.findByIdAndUpdate(userId, { $unset: { cartItems: "" } });

    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

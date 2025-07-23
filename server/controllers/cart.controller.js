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
      data: user.cartItems,
      message: `${product.name} added to cart!`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    // Authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartItems = user.cartItems;

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Your cart is currently empty.",
      });
    }

    const productIds = cartItems.map((item) => item.productId);

    // Fetch products using the product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Optionally merge product data with quantity
    const cartDetails = cartItems.map((item) => {
      const product = products.find(
        (prod) => prod._id.toString() === item.productId.toString()
      );
      return {
        ...product?._doc,
        quantity: item.quantity,
      };
    });

    return res.status(200).json({
      success: true,
      data: cartDetails,
      message: "Cart products retrieved successfully.",
    });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cart items.",
    });
  }
};

export const viewCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.cartItems || user.cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Your cart is empty.",
      });
    }

    const cartItems = user.cartItems;
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Merge quantity with product details and compute total
    const cartDetails = cartItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );

      const quantity = item.quantity;
      const price = product?.offerPrice || 0;

      return {
        _id: product?._id,
        name: product?.name,
        images: product?.images,
        offerPrice: product?.offerPrice,
        originalPrice: product?.price,
        quantity,
        total: price * quantity,
      };
    });

    // Compute grand total
    const grandTotal = cartDetails.reduce((acc, item) => acc + item.total, 0);

    return res.status(200).json({
      success: true,
      data: {
        cartItems: cartDetails,
        grandTotal,
      },
      message: "Cart retrieved successfully.",
    });
  } catch (err) {
    console.error("Error viewing cart:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to view cart.",
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

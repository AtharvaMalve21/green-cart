import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id: productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // case 1: checking for logged in user
    if (req.user) {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const existingItemIndex = user.cartItems.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        user.cartItems[existingItemIndex].quantity += quantity;
      } else {
        user.cartItems.push({ productId, quantity });
      }

      await user.save();

      return res.status(201).json({
        success: true,
        data: user.cartItems,
        message: `${product.name} added to your cart.`,
      });
    }

    // case 2: checking for the user who is not logged in or simply a guest user
    return res.status(200).json({
      success: true,
      guest: true,
      data: {
        _id: product._id,
        name: product.name,
        price: product.price,
        size: product.size || null,
        images: product.images,
        quantity,
      },
      message: `${product.name} added to your cart.`,
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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required to view cart.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartItems = user.cartItems || [];

    if (cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Your cart is currently empty.",
      });
    }

    
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartDetails = cartItems
      .map((item) => {
        const product = products.find(
          (prod) => prod._id.toString() === item.productId.toString()
        );

        if (!product) return null;

        return {
          ...product._doc,
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      data: cartDetails,
      message: "Cart products retrieved successfully.",
    });
  } catch (err) {
    console.error("Cart Fetch Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cart items.",
    });
  }
};

export const viewCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required to view cart.",
      });
    }

    const user = await User.findById(req.user._id);
    const cartItems = user?.cartItems || [];

    if (cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Your cart is empty.",
      });
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

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
    return res.status(500).json({
      success: false,
      message: "Failed to view cart.",
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const cartItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }
    cartItem.quantity = quantity;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully.",
      data: user.cartItems,
    });
  } catch (error) {
    console.error("Update cart item quantity error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const removeItemsFromCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required to remove items from cart.",
      });
    }

    const user = await User.findById(req.user._id);
    const { id: productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found.",
      });
    }

    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product not in cart.",
      });
    }

    // ❌ No quantity check — just remove the item completely
    user.cartItems.splice(existingItemIndex, 1);

    await user.save();

    return res.status(200).json({
      success: true,
      data: user.cartItems,
      message: `${product.name} removed from cart.`,
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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required to clear cart.",
      });
    }

    const user = await User.findById(req.user._id);
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

export const syncProductDetailsWithLoggedInUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems } = req.body; // [{ productId, quantity }]

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Merge logic for cartItems inside User model
    cartItems.forEach((incomingItem) => {
      const index = user.cartItems.findIndex(
        (item) => item.productId.toString() === incomingItem.productId
      );

      if (index !== -1) {
        // Product already exists in cart → update quantity
        user.cartItems[index].quantity += incomingItem.quantity;
      } else {
        // New product → push to user's cart
        user.cartItems.push(incomingItem);
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart synced successfully with user.",
      cart: user.cartItems,
    });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to sync cart with user.",
    });
  }
};

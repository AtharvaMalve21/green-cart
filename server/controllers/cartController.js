const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

//only users can access this route
exports.addToCart = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    //find the product
    const { id: productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No Product found.",
      });
    }

    const { quantity } = req.body;

    if (!quantity || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid quantity (minimum 1).",
      });
    }

    let totalPrice = product.price * quantity;

    //check if the product already exists in the cart
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const cartItem = cart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.price += totalPrice;
      } else {
        cart.products.push({
          productId: productId,
          quantity: quantity,
          price: totalPrice,
        });
      }
      await cart.save();
    } else {
      //create a new cart
      cart = await Cart.create({
        products: [
          {
            productId: productId,
            quantity: quantity,
            price: totalPrice,
          },
        ],
        user: userId,
      });
    }

    if (!user.cartItems || user.cartItems.toString() !== cart._id.toString()) {
      user.cartItems = cart._id;
      await user.save();
    }

    await cart.populate("products.productId");

    //return response
    return res.status(201).json({
      success: true,
      data: cart,
      message: "Item added to Cart!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.getCartItems = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    //find the user specific cart
    const cart = await Cart.find({
      user: userId,
    })
      .populate("products.productId")
      .populate("user");

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Cart Items fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.viewCartItem = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const cart = await Cart.findOne({
      user: userId,
      _id: id,
    })
      .populate("products.productId")
      .populate("user");

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Cart Item data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.removeItemFromCart = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    //find the product in the cart
    const { id: productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No Product found.",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "No Cart found.",
      });
    }

    //only authorized user can remove item from cart
    if (cart.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to remove cart items.",
      });
    }

    //remove the item from the cart
    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );
    await cart.save();

    await cart.populate("products.productId");

    //return response
    return res.status(200).json({
      success: true,
      data: cart,
      message: "Item removed from cart.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only users can access this route
exports.removeCart = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    const { id } = req.params;
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    //only authorized user can remove item from cart
    if (cart.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to delete this cart.",
      });
    }

    await cart.deleteOne();

    if (user.cartItems || user.cartItems.toString() === cart._id.toString()) {
      //cart is present inside user model - remove
      user.cartItems = null;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart deleted.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

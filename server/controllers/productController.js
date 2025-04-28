const Product = require("../models/productModel");
const User = require("../models/userModel");

//only admins can access this route
exports.addProduct = async (req, res) => {
  try {
    //user authentication

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    //fetch details
    const { product_name, product_description, category, price, offerPrice } =
      req.body;

    const photos = req.files.map((file) => file.path);

    //validate details
    if (
      !product_name ||
      !product_description ||
      !category ||
      !price ||
      !offerPrice ||
      !photos
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    //create product
    const newProduct = await Product.create({
      product_name,
      product_description,
      category,
      price,
      offerPrice,
      photos,
    });

    //return response

    return res.status(201).json({
      success: true,
      data: newProduct,
      message: "New Product added.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(400).json({
        success: false,
        message: "No Product found",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
      message: "Product data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterProductByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category field is required.",
      });
    }

    const products = await Product.find({
      category: category,
    });

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      message: "Product data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.changeStock = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only admins can access this route
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No product found",
      });
    }
    await product.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

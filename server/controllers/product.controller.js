import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addProduct = async (req, res) => {
  try {
    
    // fetch the product details
    const { name, category, description, price, offerPrice } = req.body;

    // validate product details
    if (!name || !category || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    // check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image.",
      });
    }

    // upload all images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader
          .upload(file.path, {
            folder: "green-cart/products",
          })
          .then((result) => {
            // remove local file after uploading
            fs.unlinkSync(file.path);
            return result.secure_url;
          })
      )
    );

    // create product in DB
    const newProduct = await Product.create({
      name,
      category,
      description,
      price,
      offerPrice,
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

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

export const filterProductByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required.",
      });
    }

    const filteredProducts = await Product.find({
      category: { $regex: new RegExp(category, "i") },
    });

    return res.status(200).json({
      success: true,
      data: filteredProducts,
      message: "Products data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const viewProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is not found with the provided id.",
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

export const changeStock = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found with the provided id.",
      });
    }

    product.inStock = !product.inStock;
    await product.save();

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product stock changed successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

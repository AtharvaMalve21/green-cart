const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_description: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
    },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

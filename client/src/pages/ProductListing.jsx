import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets.js";
import { toast } from "react-hot-toast";
import { ProductContext } from "../context/ProductContext.jsx";

const ProductListing = () => {
  const { items, setItems, setCartItems, setTotalPrice } =
    useContext(ProductContext);

  const { category, id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const navigate = useNavigate();

  const filteredProductsByCategory = dummyProducts.filter(
    (product) => product.category.toLowerCase() === category
  );

  const product = filteredProductsByCategory.find((item) => item._id === id);

  const addItemsToCart = (product) => {
    setItems(items + 1);

    setCartItems((prevItems) => [...prevItems, product]);

    setTotalPrice((prevPrice) => prevPrice + product.price);

    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      {product && (
        <h1 className="text-sm text-gray-500 mb-4">
          Home / Products / {product.category} /{" "}
          <span className="font-medium text-gray-700">{product.name}</span>
        </h1>
      )}

      {/* Product Info */}
      {product && (
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <img
              src={product.image[selectedImageIndex]}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-lg shadow-sm mb-4"
            />

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <div className="flex items-center gap-4 mb-3">
              <p className="text-2xl text-green-600 font-bold">
                ₹{product.offerPrice}
              </p>
              <p className="text-base text-gray-500 line-through">
                ₹{product.price}
              </p>
              <p className="text-sm text-gray-400">(inclusive of all taxes)</p>
            </div>

            <h3 className="text-lg font-semibold mt-4 mb-2">About Product</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  addItemsToCart(product);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="mt-16">
        <h1 className="text-xl font-semibold mb-6">Related Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProductsByCategory.map((product) => (
            <div
              onClick={() => {
                navigate(
                  `/products/${product.category.toLocaleLowerCase()}/${
                    product._id
                  }`
                );
              }}
              key={product._id}
              className="bg-white cursor-pointer rounded-xl shadow hover:shadow-md transition duration-300 p-3 flex flex-col"
            >
              {/* Product Image */}
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />

              {/* Category + Name */}
              <div className="flex flex-col gap-1 mb-2">
                <p className="text-xs text-gray-400">{product.category}</p>
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {product.name}
                </h2>
              </div>

              {/* Star Ratings */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(4)].map((_, index) => (
                  <StarIcon key={index} className="w-4 h-4 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-500">(5)</span>
              </div>

              {/* Price + Add Button Row */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold text-lg">
                    ₹{product.offerPrice}
                  </span>
                  <span className="text-gray-400 line-through text-md">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addItemsToCart(product);
                  }}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link */}
        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="text-blue-600 hover:underline font-medium"
          >
            See More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductListing = () => {
  const [product, setProduct] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState(
    []
  );

  const { category, id } = useParams();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/product/${id}`);

      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const fetchProductDetailsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${URI}/api/product/filter?category=${category}`
      );

      if (data.success) {
        setFilteredProductsByCategory(data.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchProductDetailsByCategory();
    fetchProductDetails();
  }, [category, id]);

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
        <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-[400px] bg-green-50 object-cover rounded-lg shadow-sm mb-4"
            />

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, index) => (
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
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
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
                  `/products/${product.category.toLowerCase()}/${product._id}`
                );
              }}
              key={product._id}
              className="bg-white cursor-pointer rounded-xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300 p-3 flex flex-col"
            >
              {/* Product Image with bg-green-50 */}
              <div className="bg-green-50 rounded-md mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded-md transition-transform duration-300 hover:scale-105"
                />
              </div>

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
                  onClick={(e) => {
                    e.stopPropagation();
                    addItemsToCart(product);
                  }}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition-all duration-300 text-sm hover:scale-105"
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
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-block px-5 py-2 border border-blue-600 text-blue-600 rounded-full font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-md"
          >
            See More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

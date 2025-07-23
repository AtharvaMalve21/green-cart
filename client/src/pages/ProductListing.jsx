import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { CartItemContext } from "../context/CartItemContext";

const ProductListing = () => {
  const [product, setProduct] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState(
    []
  );

  const { category, id } = useParams();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});
  const { addToCart } = useContext(CartItemContext);

  const handleAddClick = (productId) => {
    const newQuantities = { ...quantities, [productId]: 1 };
    setQuantities(newQuantities);
    addToCart(productId, 1);
  };

  const handleIncrement = (productId) => {
    const newQty = (quantities[productId] || 0) + 1;
    setQuantities({ ...quantities, [productId]: newQty });
    addToCart(productId, newQty);
  };

  const handleDecrement = (productId) => {
    const newQty = Math.max((quantities[productId] || 1) - 1, 0);
    setQuantities({ ...quantities, [productId]: newQty });
    addToCart(productId, newQty);
  };

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
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-medium py-2">
          <button
            onClick={() => navigate("/")}
            type="button"
            aria-label="Home"
            className="hover:text-blue-600 transition-colors"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-1"
            >
              <path
                d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
                fill="#475569"
                stroke="#475569"
                stroke-width=".094"
              />
            </svg>
          </button>

          <span className="text-gray-400">/</span>

          <span
            onClick={() => navigate("/products")}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Products
          </span>

          <span className="text-gray-400">/</span>

          <span
            onClick={() => navigate(`/products/${product.category}`)}
            className="hover:text-blue-600 transition-colors cursor-pointer capitalize"
          >
            {product.category}
          </span>

          <span className="text-gray-400">/</span>

          <span className="text-gray-700 font-semibold capitalize">
            {product.name}
          </span>
        </div>
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
          <div className="px-2">
            <h2 className="text-2xl font-semibold mb-3">{product.name}</h2>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
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
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-green-500">
                {!quantities[product._id] || quantities[product._id] === 0 ? (
                  <button
                    className="flex items-center justify-center gap-1 bg-green-100 border border-green-300 md:w-[80px] w-[70px] h-[36px] rounded text-green-600 font-medium hover:shadow-sm transition"
                    onClick={() => handleAddClick(product._id)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-green-400"
                    >
                      <path
                        d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                        stroke="#16a34a"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[36px] bg-green-500/20 border border-green-400 rounded select-none shadow-sm">
                    <button
                      onClick={() => handleDecrement(product._id)}
                      className="text-lg px-2 h-full font-semibold hover:text-green-700"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-base font-medium">
                      {quantities[product._id]}
                    </span>
                    <button
                      onClick={() => handleIncrement(product._id)}
                      className="text-lg px-2 h-full font-semibold hover:text-green-700"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts
        filteredProductsByCategory={filteredProductsByCategory}
        id={id}
      />
    </div>
  );
};

export default ProductListing;

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { CartItemContext } from "../context/CartItemContext";

const RelatedProducts = ({ filteredProductsByCategory, id }) => {
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

  return (
    <div className="mt-16">
      <div className="flex flex-col items-center mb-2 justify-center w-full">
        <p className="text-2xl text-gray-600 text-center font-bold uppercase">Related Products</p>
        <div className="w-16 h-0.5 bg-green-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProductsByCategory
          .filter((p) => p._id !== id)
          .map((product) => (
            <div
              key={product._id}
              className="bg-white cursor-pointer rounded-xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300 p-3 flex flex-col"
            >
              {/* Image */}
              <div className="bg-green-50 rounded-md mb-4">
                <img
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${
                        product._id
                      }`
                    );
                    scrollTo(0, 0);
                  }}
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded-md transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Category + Title */}
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

              {/* Price + Add */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold text-lg">
                    ₹{product.offerPrice}
                  </span>
                  <span className="text-gray-400 line-through text-md">
                    ₹{product.price}
                  </span>
                </div>

                <div className="text-green-500">
                  {!quantities[product._id] || quantities[product._id] === 0 ? (
                    <button
                      className="flex items-center justify-center gap-1 bg-green-100 border border-green-300 md:w-[80px] w-[64px] h-[34px] rounded text-green-600 font-medium"
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
                    <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-green-500/25 rounded select-none">
                      <button
                        onClick={() => handleDecrement(product._id)}
                        className="cursor-pointer text-md px-2 h-full"
                      >
                        -
                      </button>
                      <span className="w-5 text-center">
                        {quantities[product._id]}
                      </span>
                      <button
                        onClick={() => handleIncrement(product._id)}
                        className="cursor-pointer text-md px-2 h-full"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

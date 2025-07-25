import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemContext } from "../context/CartItemContext";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart, updateQuantity, removeItemFromCart } =
    useContext(CartItemContext);
  const navigate = useNavigate();
  const [isNotified, setIsNotified] = useState(false);

  const getNotified = async () => {
    setIsNotified(true);
    toast.success("You'll be notified when it's back in stock.");
  };

  const handleAddClick = () => {
    setQuantity(1);
    addToCart(product._id, 1);
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateQuantity(product._id, newQty);
  };

  const handleDecrement = () => {
    const newQty = Math.max(quantity - 1, 0);
    setQuantity(newQty);
    if (newQty === 0) {
      removeItemFromCart(product._id);
    } else {
      updateQuantity(product._id, newQty);
    }
  };

  return (
    <div className="bg-white cursor-pointer w-[300px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col group">
      {/* Product Image */}
      <div className="bg-green-100 rounded-md mb-4 overflow-hidden">
        <img
          onClick={() =>
            navigate(
              `/products/${product.category.toLowerCase()}/${product._id}`
            )
          }
          src={product.images[0]}
          alt={product.name}
          className="w-full h-44 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Category & Name */}
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-xs text-gray-400 capitalize">{product.category}</p>
        <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h2>
      </div>

      {/* Star Ratings */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(4)].map((_, i) => (
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
        ))}
        <span className="text-xs text-gray-500">(5)</span>
      </div>

      {/* Price + Add / Notify */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold text-lg">
            &#8377;{product.offerPrice}
          </span>
          <span className="text-gray-400 line-through text-sm">
            &#8377;{product.price}
          </span>
        </div>

        {/* Conditional Controls */}
        {product.inStock ? (
          <div className="text-green-600">
            {quantity === 0 ? (
              <button
                className="flex items-center justify-center gap-1 bg-green-100 hover:bg-green-200 border border-green-300 md:w-[80px] w-[70px] h-[36px] rounded-md text-sm font-medium transition"
                onClick={handleAddClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-500"
                >
                  <path
                    d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[36px] bg-green-100 border border-green-300 rounded-md select-none">
                <button
                  onClick={handleDecrement}
                  className="px-2 text-lg font-semibold hover:text-green-700"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="px-2 text-lg font-semibold hover:text-green-700"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2 w-full">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Out of Stock
            </span>

            {!isNotified ? (
              <button
                onClick={getNotified}
                className="w-[90px] mt-1 py-2.5 px-4 rounded-md font-medium text-indigo-600 bg-white border border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all duration-200 text-sm"
              >
                Notify Me
              </button>
            ) : (
              <button
                disabled
                className="w-[90px] mt-1 py-2.5 px-4 rounded-md font-medium text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed text-sm"
              >
                Notified
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

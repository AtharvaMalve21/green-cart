import React, { useContext } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

const TopProducts = () => {
  const { products } = useContext(ProductContext);

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        {products.slice(0, 10).map((product) => (
          <div
            key={product._id}
            onClick={() =>
              navigate(
                `/products/${product.category.toLowerCase()}/${product._id}`
              )
            }
            className="bg-white cursor-pointer w-[300px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col group"
          >
            {/* Product Image */}
            <div className="bg-green-50 rounded-md mb-4 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-44 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Category & Name */}
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-xs text-gray-400 capitalize">
                {product.category}
              </p>
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

            {/* Price + Add Button */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold text-lg">
                  ₹{product.offerPrice}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.price}
                </span>
              </div>

              <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-all duration-300 text-sm hover:scale-105">
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
    </div>
  );
};

export default TopProducts;

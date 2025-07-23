import React, { useContext, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

const TopProducts = () => {
  const { products } = useContext(ProductContext);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        {products.slice(0, 10).map((product) => (
          <div
            key={product._id}
            className="bg-white cursor-pointer w-[300px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col group"
          >
            {/* Product Image */}
            <div className="bg-green-50 rounded-md mb-4 overflow-hidden">
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

              <div className="text-green-500">
                {count === 0 ? (
                  <button
                    className="flex items-center justify-center gap-1 bg-green-100 border border-green-300 md:w-[80px] w-[64px] h-[34px] rounded text-green-600 font-medium"
                    onClick={() => setCount(1)}
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-green-500/25 rounded select-none">
                    <button
                      onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
                      className="cursor-pointer text-md px-2 h-full"
                    >
                      -
                    </button>
                    <span className="w-5 text-center">{count}</span>
                    <button
                      onClick={() => setCount((prev) => prev + 1)}
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

export default TopProducts;

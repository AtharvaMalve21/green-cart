import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid"; // Make sure to install Heroicons or replace with your star icon
// import { StarIcon } from "lucide-react"; // Or another icon library

const RelatedProducts = ({ filteredProductsByCategory, id }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  return (
    <div className="mt-16">
      <h1 className="text-xl font-semibold mb-6">Related Products</h1>

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
                        onClick={() =>
                          setCount((prev) => Math.max(prev - 1, 0))
                        }
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

export default RelatedProducts;

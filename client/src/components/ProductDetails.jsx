import React, { useState } from "react";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product, handleAddToCart, handleBuyNow }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isNotified, setIsNotified] = useState(false);

  const getNotified = async () => {
    setIsNotified(true);
    toast.success("You'll be notified when it's back in stock.");
  };

  return (
    <div className="flex flex-col md:flex-row gap-16">
      {/* Image Gallery */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-3">
          {product.images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`border max-w-24 rounded overflow-hidden cursor-pointer ${
                selectedImageIndex === index
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <img
                src={img ? img : product.images[0]}
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className="border border-gray-300 max-w-100 rounded overflow-hidden">
          <img
            src={product.images[selectedImageIndex]}
            alt="Main Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="text-sm w-full md:w-1/2">
        <h1 className="text-3xl font-medium">{product.name}</h1>

        {/* Rating Stars */}
        <div className="flex items-center gap-2 mt-2">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <svg
                key={i}
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.05.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.59 13.63a1 1 0 0 0-1.176 0l-3.39 2.46c-.783.57-1.838-.197-1.54-1.118l1.294-3.983a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .951-.69z"
                  fill={i < 4 ? "#22c55e" : "#bbf7d0"} // 4 stars filled
                />
              </svg>
            ))}
          <p className="ml-2 text-base text-green-700">(4)</p>
        </div>

        {/* Price Section */}
        <div className="mt-6">
          <p className="text-gray-500/70 line-through">MRP: &#8377;{product.price}</p>
          <p className="text-2xl font-medium text-gray-700">
            MRP: &#8377;{product.offerPrice}
          </p>
          <span className="text-gray-500/70">(inclusive of all taxes)</span>
        </div>

        {/* Description */}
        <p className="text-base font-medium mt-6">About Product</p>
        <ul className="list-disc ml-4 text-gray-500/70">
          {product.description.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>

        {/* Action Buttons */}
        {product.inStock ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-10 gap-4 text-base w-full">
            <div className="w-full text-green-600">
              <button
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>

            <button onClick={() => handleBuyNow(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-green-800 text-white hover:bg-green-700 transition">
              Buy Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-10 gap-4 w-full text-base">
            <button
              disabled
              className="w-full py-3.5 cursor-not-allowed font-medium bg-red-100 text-red-600 border border-red-200"
            >
              Out of Stock
            </button>

            {!isNotified && (
              <button
                onClick={getNotified}
                className="w-full py-3.5 font-medium text-indigo-600 border border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition"
              >
                Notify Me
              </button>
            )}

            {isNotified && (
              <button
                disabled
                className="w-full py-3.5 font-medium text-gray-400 border border-gray-300 bg-gray-100 cursor-not-allowed"
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

export default ProductDetails;

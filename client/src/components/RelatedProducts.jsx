import React from "react";
import ProductCard from "./ProductCard.jsx";

const RelatedProducts = ({ filteredProductsByCategory, id }) => {
  return (
    <div className="mt-16">
      <div className="flex flex-col items-center mb-2 justify-center w-full">
        <p className="text-2xl text-gray-600 text-center font-bold uppercase">
          Related Products
        </p>
        <div className="w-16 h-0.5 bg-green-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProductsByCategory
          .filter((p) => p._id !== id)
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

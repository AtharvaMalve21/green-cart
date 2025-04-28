import React from "react";
import { dummyProducts } from "../assets/assets";
import ProductCart from "./ProductCart";

const BestSeller = () => {
  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-green-600 tracking-tight mb-2">
          Top Picks Just for You!
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          Explore our most popular products loved by customers and rated with
          top stars.
        </p>
      </div>
      <ProductCart dummyProducts={dummyProducts} />
    </div>
  );
};

export default BestSeller;

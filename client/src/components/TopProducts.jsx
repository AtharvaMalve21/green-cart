import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext.jsx";
import ProductCard from "./ProductCard.jsx";

const TopProducts = () => {
  const { products } = useContext(ProductContext);

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        {products.slice(0, 10).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default TopProducts;

import React, { useContext, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard.jsx";
import { useLocation } from "react-router-dom";

const Products = () => {
  const { products, setProducts, allProducts } = useContext(ProductContext);
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const categoryFromUrl = pathParts.length > 1 ? pathParts[1] : null;

  const heading = categoryFromUrl
    ? `Fresh ${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)}`
    : "All Products";

  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  return (
    <div className="p-4">
      <div className="flex ml-20 mb-5 flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">{heading}</p>
        <div className="w-16 h-0.5 bg-green-400 rounded-full"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;

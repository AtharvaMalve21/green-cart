import React from "react";
import { dummyProducts } from "../assets/assets";
import ProductCart from "../components/ProductCart";

const Products = () => {
  return (
    <div>
      <ProductCart dummyProducts={dummyProducts} />
    </div>
  );
};

export default Products;

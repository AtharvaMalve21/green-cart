import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import ProductCart from "../components/ProductCart";

const ProductCategory = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);

  const filteredProducts = () => {
    setProducts(() => {
      return dummyProducts.filter(
        (p) => p.category.toLocaleLowerCase() == category
      );
    });
  };

  useEffect(() => {
    filteredProducts();
  }, []);

  return (
    <div>
      <ProductCart dummyProducts={products} />
    </div>
  );
};

export default ProductCategory;

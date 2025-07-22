import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import Products from "./Products";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ProductContext } from "../context/ProductContext";

const ProductCategory = () => {
  const { category } = useParams();

  const { setProducts } = useContext(ProductContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const filteredProducts = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/product/filter`, {
        params: {
          category: category,
        },
      });
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    filteredProducts();
  }, [category]);

  return (
    <div>
      <Products />
    </div>
  );
};

export default ProductCategory;

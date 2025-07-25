import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import RelatedProducts from "../components/RelatedProducts";
import { CartItemContext } from "../context/CartItemContext";
import BreadCrumb from "../components/BreadCrumb";
import ProductDetails from "../components/ProductDetails";

const ProductListing = () => {
  const [product, setProduct] = useState(null);

  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState(
    []
  );
  const [quantities, setQuantities] = useState({});

  const navigate = useNavigate();

  const { category, id } = useParams();
  const URI = import.meta.env.VITE_BACKEND_URI;
  const { addToCart } = useContext(CartItemContext);

  const handleAddToCart = (productId) => {
    const newQuantities = { ...quantities, [productId]: 1 };
    setQuantities(newQuantities);
    addToCart(productId, 1);
  };

  const handleBuyNow = (productId) => {
    const newQuantities = { ...quantities, [productId]: 1 };
    setQuantities(newQuantities);
    addToCart(productId, 1);
    navigate("/cart");
  };

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/product/${id}`);
      if (data.success) setProduct(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch product");
    }
  };

  const fetchProductDetailsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${URI}/api/product/filter?category=${category}`
      );
      if (data.success) setFilteredProductsByCategory(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch category");
    }
  };

  useEffect(() => {
    fetchProductDetailsByCategory();
    fetchProductDetails();
  }, [category, id]);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      {product && (
        <>
          {/* Breadcrumb */}
          <BreadCrumb product={product} />

          {/* Product View */}
          <ProductDetails
            handleAddToCart={handleAddToCart}
            product={product}
            handleBuyNow={handleBuyNow}
          />

          {/* Related Products */}
          <RelatedProducts
            filteredProductsByCategory={filteredProductsByCategory}
            id={id}
          />
        </>
      )}
    </div>
  );
};

export default ProductListing;

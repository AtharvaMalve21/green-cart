import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import RelatedProducts from "../components/RelatedProducts";
import { CartItemContext } from "../context/CartItemContext";

const ProductListing = () => {
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState(
    []
  );
  const [quantities, setQuantities] = useState({});

  const { category, id } = useParams();
  const URI = import.meta.env.VITE_BACKEND_URI;
  const { addToCart } = useContext(CartItemContext);
  const navigate = useNavigate();

  const handleAddClick = (productId) => {
    const newQuantities = { ...quantities, [productId]: 1 };
    setQuantities(newQuantities);
    addToCart(productId, 1);
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
    <div className="max-w-6xl mx-auto w-full px-6 py-8">
      {product && (
        <>
          {/* Breadcrumb */}
          <div className="flex flex-wrap mb-5 items-center space-x-2 text-sm text-gray-500 font-medium">
            <button
              onClick={() => navigate("/")}
              type="button"
              aria-label="Home"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
                  fill="#475569"
                  stroke="#475569"
                  stroke-width=".094"
                />
              </svg>
            </button>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z"
                fill="#CBD5E1"
              />
            </svg>
            <Link to={"/products"}>Products</Link>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z"
                fill="#CBD5E1"
              />
            </svg>
            <Link to={`/products/${product.category.toLowerCase()}`}>
              {product.category}
            </Link>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z"
                fill="#CBD5E1"
              />
            </svg>
            <p className="text-green-800/100 text-lg">{product.name}</p>
          </div>

          {/* Product View */}
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
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
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
                <p className="text-gray-500/70 line-through">
                  MRP: ${product.price}
                </p>
                <p className="text-2xl font-medium text-gray-700">
                  MRP: ${product.offerPrice}
                </p>
                <span className="text-gray-500/70">
                  (inclusive of all taxes)
                </span>
              </div>

              {/* Description */}
              <p className="text-base font-medium mt-6">About Product</p>
              <ul className="list-disc ml-4 text-gray-500/70">
                {product.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center mt-10 gap-4 text-base w-full">
                <div className="w-full text-green-600">
                  <button
                    className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                    onClick={() => handleAddClick(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>

                <button className="w-full py-3.5 cursor-pointer font-medium bg-green-800/100 text-white hover:bg-green-800/70 transition">
                  Buy now
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-10">
            <RelatedProducts
              filteredProductsByCategory={filteredProductsByCategory}
              id={id}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListing;

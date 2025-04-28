import React, { useContext } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductCart = ({ dummyProducts }) => {
  // const { items, setItems, cartItems, setCartItems } =
  //   useContext(ProductContext);

  // const handleAddToCart = (productId) => {
  //   setCartItems((prev) => ({ ...prev, [productId]: 1 }));
  //   setItems(items + 1);
  //   toast.success("Item added to cart");
  // };

  // const incrementItem = (productId) => {
  //   setCartItems((prev) => {
  //     const updated = { ...prev, [productId]: prev[productId] + 1 };
  //     return updated;
  //   });
  //   setItems(items + 1);
  // };

  // const decrementItem = (productId) => {
  //   setCartItems((prev) => {
  //     const currentCount = prev[productId];
  //     if (currentCount === 1) {
  //       const { [productId]: _, ...rest } = prev; // remove item
  //       toast.success("Item removed from cart");
  //       return rest;
  //     }
  //     return { ...prev, [productId]: currentCount - 1 };
  //   });
  //   setItems(items - 1);
  // };

  const { items, setItems, setCartItems, setTotalPrice } =
    useContext(ProductContext);

  const navigate = useNavigate();

  const addItems = (product) => {
    setItems(items + 1);

    console.log(product);

    setCartItems((prevItems) => [...prevItems, product]);

    setTotalPrice((prevPrice) => prevPrice + product.price);

    toast.success(`Item added to cart`);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {dummyProducts.map((product) => {
          return (
            <div
              key={product._id}
              className="bg-white cursor-pointer rounded-xl shadow hover:shadow-md transition duration-300 p-3 flex flex-col"
            >
              {/* Product Image */}
              <img
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLocaleLowerCase()}/${
                      product._id
                    }`
                  );
                }}
                src={product.image[0]}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />

              {/* Category + Name */}
              <div className="flex flex-col gap-1 mb-2">
                <p className="text-xs text-gray-400">{product.category}</p>
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {product.name}
                </h2>
              </div>

              {/* Star Ratings */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(4)].map((_, index) => (
                  <StarIcon key={index} className="w-4 h-4 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-500">(4)</span>
              </div>

              {/* Price + Add Button Row */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold text-lg">
                    ₹{product.offerPrice}
                  </span>
                  <span className="text-gray-400 line-through text-md">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addItems(product);
                  }}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCart;

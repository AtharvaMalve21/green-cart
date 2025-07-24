import React, { useContext, useEffect, useMemo, useState } from "react";
import { CartItemContext } from "../context/CartItemContext.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary.jsx";

const Cart = () => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [showAddress, setShowAddress] = React.useState(false);
  const { cartItems, fetchCartDetails, removeItemFromCart, updateQuantity } =
    useContext(CartItemContext);
  const navigate = useNavigate();

  console.log(cartItems);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const placeOrder = () => {
    toast.success(
      `Order Placed successfully. Your total bill including gst is Rs. ${totalAmount.total}`
    );
    setIsOrderPlaced(true);
  };

  const totalAmount = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.offerPrice * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.02);
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [cartItems]);

  useEffect(() => {
    fetchCartDetails();
  }, []);

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-7xl w-full px-6 mx-auto gap-10">
      <div className="flex-1 max-w-4xl bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-green-500">
            {cartItems?.length} {cartItems?.length === 1 ? " Item" : "Items"}
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartItems.map((product) => (
          <div
            key={product._id}
            className={`grid grid-cols-[2fr_1fr_1fr] items-center gap-4 py-4 border-b border-gray-200 ${
              !product.inStock ? "bg-red-50/50" : ""
            }`}
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() =>
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  )
                }
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product?.images[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold text-gray-800">
                  {product.name}
                </p>
                <div className="font-normal text-sm text-gray-500">
                  <p>
                    Weight:{" "}
                    <span className="text-gray-700">
                      {product.size || "N/A"}
                    </span>
                  </p>

                  {/* In-stock check */}
                  {!product.inStock ? (
                    <p className="mt-2 text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 inline-block rounded">
                      Currently unavailable
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <p>Qty:</p>
                      <select
                        className="text-gray-800 text-sm rounded-md px-2 py-1 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={product.quantity}
                        onChange={(e) =>
                          updateQuantity(product._id, parseInt(e.target.value))
                        }
                      >
                        {[1, 2, 3, 4, 5].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-center text-gray-700 font-medium">
              ₹{product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeItemFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                  stroke="#FF532E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}

        <Link
          to="/products"
          className="group mt-10 inline-flex items-center gap-2 text-green-600 font-medium hover:underline transition"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#28A745"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <OrderSummary
        showAddress={showAddress}
        setShowAddress={setShowAddress}
        placeOrder={placeOrder}
        totalAmount={totalAmount}
        isOrderPlaced={isOrderPlaced}
      
      />
    </div>
  );
};

export default Cart;

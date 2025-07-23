import React, { useContext, useEffect, useMemo, useState } from "react";
import { CartItemContext } from "../context/CartItemContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoader } from "../context/LoaderContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [showAddress, setShowAddress] = React.useState(false);
  const { cartItems, fetchCartDetails, setCartItems } =
    useContext(CartItemContext);
  const { setLoading } = useLoader();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const navigate = useNavigate();

  console.log(cartItems);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const removeItemFromCart = async (productId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${URI}/api/cart/${productId}`, {
        withCredentials: true,
      });

      if (data.success) {
        // ✅ Remove from local state
        const updatedCart = cartItems.filter((item) => item._id !== productId);
        setCartItems(updatedCart); // 👈 Ensure this is exposed via context

        // Optional: fetch fresh data
        fetchCartDetails();
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put(
        `${URI}/api/cart`,
        { productId, quantity },
        { withCredentials: true }
      );

      if (data.success) {
        // ✅ Update the cartItems state manually
        const updatedCart = cartItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart); // 👈 Ensure this is exposed via context

        // Optional: sync from backend again
        fetchCartDetails();
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.error("Failed to update quantity");
    }
  };

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
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
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
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() =>
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  )
                }
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product?.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Size: <span>{product.size || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      className="outline-none ml-2 border border-gray-300 rounded px-2 py-1"
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
                </div>
              </div>
            </div>

            <p className="text-center">
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
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
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
              stroke="#615fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">No address found</p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                <p
                  onClick={() => setShowAddress(false)}
                  className="text-gray-500 p-2 hover:bg-gray-100"
                >
                  New York, USA
                </p>
                <p
                  onClick={() => setShowAddress(false)}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>₹{totalAmount.subtotal}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>₹{totalAmount.tax}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>₹{totalAmount.total}</span>
          </p>
        </div>
        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        >
          {!isOrderPlaced ? "Place Order" : "ORDER PLACED"}
        </button>
      </div>
    </div>
  );
};

export default Cart;

import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { OrderContext } from "../context/OrderContext.jsx";

const Cart = () => {
  const {
    cartItems,
    items,
    setCartItems,
    totalPrice,
    setItems,
    setTotalPrice,
  } = useContext(ProductContext);

  const { setOrders } = useContext(OrderContext);

  const placeOrder = (items) => {
    setOrders(items);
    toast.success(`Order successfully placed. Total bill is ₹${totalPrice}.`);
  };

  const removeItemFromCart = (id) => {
    const product = cartItems.find((p) => p._id === id);
    const filteredItems = cartItems.filter((item) => item._id !== id);

    setCartItems(filteredItems);
    setItems(items - 1);
    setTotalPrice((prevPrice) => prevPrice - product.price);

    toast.success(`${product.name} removed from cart`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-xl shadow p-4 gap-4 relative"
              >
                {/* Delete Icon */}
                <button
                  onClick={() => removeItemFromCart(item._id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                {/* Product Image */}
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />

                {/* Product Details */}
                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-green-600 font-semibold">₹{item.price}</p>
                  <p className="text-sm text-gray-400">
                    In Stock: {item.inStock}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {item.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800 font-medium">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Delivery:</span>
              <span className="text-gray-800 font-medium">Free</span>
            </div>
            <hr className="mb-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              onClick={() => {
                placeOrder(cartItems);
              }}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
            >
              Place Order
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Items added to Cart
          </h2>
          <Products />
        </div>
      )}
    </div>
  );
};

export default Cart;

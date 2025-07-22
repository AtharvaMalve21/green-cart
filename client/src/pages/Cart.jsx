import React from "react";
import Products from "./Products";

const Cart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-xl font-semibold text-gray-700">
        No Items added to Cart
      </h2>
      <Products />
    </div>
  );
};

export default Cart;

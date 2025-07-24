import React, { useState } from "react";

const OrderSummary = ({
  showAddress,
  setShowAddress,
  placeOrder,
  totalAmount,
  isOrderPlaced,
}) => {
  return (
    <div className="max-w-[360px] w-full bg-white p-6 shadow-xl rounded-2xl border border-gray-200 max-md:mt-10 h-fit">
      <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
      <hr className="border-gray-300 my-5" />

      <div className="mb-6">
        <p className="text-sm font-medium uppercase">Delivery Address</p>
        <div className="relative flex justify-between items-start mt-2">
          <p className="text-gray-500">No address found</p>
          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-green-500 hover:underline cursor-pointer"
          >
            Change
          </button>
          {showAddress && (
            <div className="absolute top-12 z-10 left-0 py-1 bg-white border border-gray-300 shadow-md rounded-md text-sm w-full">
              <p
                onClick={() => setShowAddress(false)}
                className="text-gray-500 p-2 hover:bg-gray-100"
              >
                New York, USA
              </p>
              <p
                onClick={() => setShowAddress(false)}
                className="text-green-700 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
              >
                Add address
              </p>
            </div>
          )}
        </div>

        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

        <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>
      </div>

      <hr className="border-gray-300" />

      <div className="text-gray-500 mt-4 space-y-2">
        <p className="flex justify-between">
          <span>Price</span>
          <span>${totalAmount.subtotal}</span>
        </p>
        <p className="flex justify-between">
          <span>Shipping Fee</span>
          <span className="text-green-600">Free</span>
        </p>
        <p className="flex justify-between">
          <span>Tax (2%)</span>
          <span>${totalAmount.tax}</span>
        </p>
        <p className="flex justify-between text-lg font-semibold mt-4 text-gray-800">
          <span>Total Amount:</span>
          <span>${totalAmount.total}</span>
        </p>
      </div>
      <button
        onClick={placeOrder}
        disabled={isOrderPlaced}
        className={`w-full py-3 mt-6 rounded-md text-white font-semibold transition ${
          isOrderPlaced
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {!isOrderPlaced ? "Place Order" : "ORDER PLACED"}
      </button>
    </div>
  );
};

export default OrderSummary;

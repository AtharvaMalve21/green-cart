import React, { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import { UserContext } from "../context/UserContext";

const MyOrders = () => {
  const { orders } = useContext(OrderContext);
  const { user } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Orders
      </h1>

      {orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition"
            >
              {/* Product Image */}
              <img
                src={order.image?.[0] || "https://via.placeholder.com/150"}
                alt={order.name}
                className="w-full md:w-32 h-32 object-cover rounded-lg border"
              />

              {/* Order Content */}
              <div className="flex-1 space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Order ID:</span> {order._id}
                </p>

                <h2 className="text-xl font-semibold text-gray-800">
                  {order.name}
                </h2>

                <p className="text-sm text-gray-500 capitalize">
                  Category: {order.category}
                </p>

                {/* Description */}
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {order.description?.slice(0, 3).map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>

                {/* Price */}
                <p className="text-green-600 font-bold text-lg mt-2">
                  ₹{order.price}
                </p>

                {/* Shipping Details */}
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-700 font-semibold mb-2">
                    Shipping Details:
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        user?.profilePic
                          ? `${URI}/${user.profilePic}`
                          : "https://via.placeholder.com/40"
                      }
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-sm text-gray-500">{user?.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">You haven't placed any orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

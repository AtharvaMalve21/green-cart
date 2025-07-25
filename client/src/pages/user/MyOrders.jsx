import React, { useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { OrderContext } from "../../context/OrderContext";
import moment from "moment";

const MyOrders = () => {
  const { orders, setOrders } = useContext(OrderContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(URI + "/api/order", {
        withCredentials: true,
      });
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 md:p-10 space-y-6 min-h-screen bg-white">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">🛍️ Your Orders</h2>

      {orders &&
        orders?.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white p-5 max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr] items-start gap-6">
              {/* Order Items */}
              <div className="flex flex-col gap-4">
                {order.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border border-gray-100 rounded-md p-2 bg-gray-50"
                  >
                    <img
                      src={item?.product?.images[0]}
                      alt="product-icon"
                      className="w-10 h-10 opacity-70"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.product?.name}
                        {item.quantity > 1 && (
                          <span className="text-green-600">
                            {" "}
                            × {item?.quantity}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.product?.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="text-sm leading-5 text-gray-700">
                <p className="font-semibold text-green-700 mb-1">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p>{order.address?.street}</p>
                <p>
                  {order.address?.city}, {order.address?.state} -{" "}
                  {order.address?.zipcode}
                </p>
                <p>{order.address?.country}</p>
              </div>

              {/* Total Amount */}
              <div className="text-center my-auto">
                <p className="text-green-700 font-semibold">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Payment Info */}
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                </p>
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  <span
                    className={`font-semibold ${
                      order.paymentStatus?.toLowerCase() === "paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}

      {orders.length === 0 && (
        <p className="text-center text-gray-600 text-base mt-4">
          You haven’t placed any orders yet.
        </p>
      )}
    </div>
  );
};

export default MyOrders;

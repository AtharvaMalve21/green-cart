import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoader } from "../../context/LoaderContext.jsx";
import { useNavigate } from "react-router-dom";
import { CartItemContext } from "../../context/CartItemContext.jsx";

const OrderSummary = ({ totalAmount, cartItems }) => {
  const URI = import.meta.env.VITE_BACKEND_URI;
  const { setCartItems } = useContext(CartItemContext);
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const orderItems = cartItems.map((item) => ({
    product: item._id || item.id,
    quantity: item.quantity,
  }));

  const fetchUserAddress = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/address`, {
        withCredentials: true,
      });

      if (data.success) {
        setAddresses(data.data);
        if (data.data.length > 0 && !selectedAddress) {
          setSelectedAddress(data.data[0]);
        }
      }
    } catch (err) {
      console.log(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${URI}/api/address/add`, addressForm, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        await fetchUserAddress();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add address");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "GreenCart",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          setLoading(true);
          const { data } = await axios.post(
            `${URI}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            },
            {
              withCredentials: true,
            }
          );

          if (data.success) {
            toast.success(data.message);
            setCartItems([]);
            navigate("/my-orders");
          }
        } catch (err) {
          toast.error("Payment verification failed");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
    };
    console.log("DB Order ID:", order._id);
    console.log("Razorpay Order ID:", order.id);

    const rz = new window.Razorpay(options);
    rz.open();
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      return toast.error("Your cart is empty. Add items to place an order.");
    }

    if (!selectedAddress) {
      return toast.error("Please select or add a delivery address.");
    }

    try {
      setLoading(true);

      if (paymentMethod === "COD") {
        const { data } = await axios.post(
          `${URI}/api/order/cod`,
          { address: selectedAddress, orderItems },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (data.success) {
          toast.success("Order placed successfully!");
          setCartItems([]);
          setIsOrderPlaced(true);
          navigate("/my-orders");
        }
      } else {
        console.log(paymentMethod);
        // STEP 1: Create order in DB
        const { data } = await axios.post(
          `${URI}/api/order/online`,
          { address: selectedAddress, orderItems },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        console.log(data);
        const orderId = data.data;

        // STEP 2: Call Razorpay create payment
        const { data: razorpayData } = await axios.get(
          `${URI}/api/payment/order/${orderId}`,
          {
            withCredentials: true,
          }
        );
        console.log(razorpayData.data);
        if (razorpayData.success) {
          initPay(razorpayData.data);
          setIsOrderPlaced(true);
        }
      }
    } catch (err) {
      console.error(err);
      console.log(err.message);
      toast.error(err?.response?.data?.message || "Order or payment failed");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  return (
    <div className="max-w-[360px] w-full bg-white p-6 shadow-xl rounded-2xl border border-gray-200 max-md:mt-10 h-fit">
      {/** Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
            <form
              onSubmit={addAddress}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                "firstName",
                "lastName",
                "email",
                "phone",
                "street",
                "city",
                "state",
                "zipcode",
                "country",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                  required
                  value={addressForm[field]}
                  onChange={changeHandler}
                  className={`input-field ${
                    ["email", "phone", "street", "zipcode", "country"].includes(
                      field
                    )
                      ? "col-span-2"
                      : ""
                  }`}
                />
              ))}
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                >
                  Save Address
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-medium">Order Summary</h2>
      <hr className="border-gray-300 my-5" />

      {/* Address Section */}
      <div className="mb-6">
        <p className="text-sm font-medium uppercase">Delivery Address</p>
        <div className="relative mt-2">
          {selectedAddress ? (
            <div className="text-sm text-gray-600">
              <p>
                {selectedAddress.firstName} {selectedAddress.lastName}
              </p>
              <p>
                {selectedAddress.street}, {selectedAddress.city},{" "}
                {selectedAddress.state} - {selectedAddress.zipcode}
              </p>
              <p>{selectedAddress.country}</p>
              <p>Phone: {selectedAddress.phone}</p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-green-500 hover:underline text-sm mt-2"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-green-500 hover:underline text-sm"
            >
              + Add Address
            </button>
          )}

          {showAddress && (
            <div className="absolute top-full mt-2 z-10 w-full bg-white border border-gray-300 rounded-md shadow">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddress(false);
                  }}
                  className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedAddress?._id === addr._id
                      ? "bg-green-100 font-medium"
                      : ""
                  }`}
                >
                  {addr.firstName} {addr.lastName}, {addr.city}, {addr.state}
                </div>
              ))}
              <div
                onClick={() => {
                  setShowModal(true);
                  setShowAddress(false);
                }}
                className="text-center text-green-600 border-t px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                + Add new address
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <p className="text-sm font-medium uppercase mt-4">Payment Method</p>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="Online">Online Payment</option>
      </select>

      {/* Price Breakdown */}
      <div className="text-gray-600 mt-6 space-y-2">
        <p className="flex justify-between">
          <span>Subtotal:</span>
          <span>&#8377;{totalAmount.subtotal}</span>
        </p>
        <p className="flex justify-between">
          <span>Tax (2%):</span>
          <span>&#8377;{totalAmount.tax}</span>
        </p>
        <p className="flex justify-between">
          <span>Shipping:</span>
          <span className="text-green-500">Free</span>
        </p>
        <p className="flex justify-between font-semibold text-lg text-gray-800">
          <span>Total:</span>
          <span>&#8377;{totalAmount.total}</span>
        </p>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isOrderPlaced}
        className={`w-full py-3 mt-6 rounded-md text-white font-semibold transition ${
          isOrderPlaced
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isOrderPlaced ? "ORDER PLACED" : "PLACE ORDER"}
      </button>
    </div>
  );
};

export default OrderSummary;

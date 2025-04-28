import React, { useContext, useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MessageContext } from "../context/MessageContext";

const Contact = () => {
  const { setMessages } = useContext(MessageContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (ev) => {
    let { name, value } = ev.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const sendMessage = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        URI + "/api/message/send",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setMessages(data.data);
        toast.success(data.message);
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        {/* Contact Info */}
        <div className="bg-indigo-600 text-white w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

          <div className="flex items-center gap-3 mb-4">
            <MapPinIcon className="w-5 h-5" />
            <span>123 Green Street, Eco City</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <PhoneIcon className="w-5 h-5" />
            <span>+1 (800) 123-4567</span>
          </div>

          <div className="flex items-center gap-3">
            <EnvelopeIcon className="w-5 h-5" />
            <span>support@greencart.com</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Send us a message
          </h2>
          <form onSubmit={sendMessage} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-600 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm text-gray-600 mb-1"
              >
                Message
              </label>
              <textarea
                rows="4"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

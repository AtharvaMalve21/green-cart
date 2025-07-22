import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoader } from "../context/LoaderContext";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const URI = import.meta.env.VITE_BACKEND_URI;

  const { setLoading } = useLoader();

  const submitHandler = async (ev) => {
    try {
      ev.preventDefault();

      setLoading(true);

      const { data } = await axios.post(
        URI + "/api/message/send",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setEmail("");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </p>
      <form
        onSubmit={submitHandler}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          type="text"
          placeholder="Enter your email id"
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-green-700 hover:bg-green-800/80 transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;

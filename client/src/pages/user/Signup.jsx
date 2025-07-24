import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useLoader } from "../../context/LoaderContext.jsx";

import axios from "axios";

import { UserContext } from "../../context/UserContext.jsx";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const { setLoading } = useLoader();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupUserAccount = async (ev) => {
    ev.preventDefault();

    try {
      setLoading(true); // show loader

      const { data } = await axios.post(
        URI + "/api/user/signup",
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setIsLoggedIn(true);
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center bg-gradient-to-r from-green-50 via-white to-green-100 justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="mt-3 text-3xl font-bold text-gray-800">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign up to access personalized features and manage your orders.
          </p>
        </div>

        <form onSubmit={signupUserAccount} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 font-medium cursor-pointer hover:underline"
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;

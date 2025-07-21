import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useLoader } from "../context/LoaderContext";

import axios from "axios";

import { UserContext } from "../context/UserContext.jsx";
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
    <div className="h-[calc(100vh-80px)] flex items-center bg-gradient-to-r from-blue-50 via-white to-blue-100 justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <LockClosedIcon className="w-12 h-12 text-indigo-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={signupUserAccount} className="space-y-6">
          {/* Name  */}
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
              onChange={(ev) => {
                setName(ev.target.value);
              }}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter full Name"
            />
          </div>

          {/* Email  */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value);
              }}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
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
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                type={showPassword ? "text" : "password"}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="••••••••"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-indigo-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/LoaderContext.jsx";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

import axios from "axios";

import { UserContext } from "../context/UserContext.jsx";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const { setLoading } = useLoader();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUserAccount = async (ev) => {
    ev.preventDefault();

    try {
      setLoading(true); // start loader

      const { data } = await axios.post(
        URI + "/api/user/login",
        {
          email,
          password,
        },
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
      toast.error(err.response?.data.message || "Login failed");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center bg-gradient-to-r from-green-50 via-white to-green-100 justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Please enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={loginUserAccount} className="space-y-6">
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
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-indigo-500 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup now
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

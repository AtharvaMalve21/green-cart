import React, { useContext, useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext.jsx";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../context/LoaderContext.jsx";

const AdminLoginPanel = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);

  const { setIsAdminLoggedIn } = useContext(AdminContext);
  const { setLoading } = useLoader(); // ✅ hook used properly here
  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const adminLogin = async (ev) => {
    ev.preventDefault();
    try {
      setLoading(true); // ✅ start loader
      const { data } = await axios.post(
        `${URI}/api/admin/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setIsAdminLoggedIn(true);
        toast.success(data.message);
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  return (
    <form
      onSubmit={adminLogin}
      className="max-w-md mx-auto mt-20 px-8 py-10 bg-white shadow-2xl rounded-2xl space-y-8 border border-gray-200"
    >
      <h1 className="text-3xl font-extrabold text-center text-gray-800">
        <span className="text-indigo-600">Admin</span> Login
      </h1>

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 transition focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="admin@example.com"
            className="w-full bg-transparent text-sm text-gray-800 outline-none"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 transition focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <LockClosedIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent text-sm text-gray-800 outline-none"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="focus:outline-none ml-2"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
      >
        Login
      </button>
    </form>
  );
};

export default AdminLoginPanel;

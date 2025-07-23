import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [items,setItems] = useState(0);

  const { user, isLoggedIn, setIsLoggedIn, setUser } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const logoutUserAccount = async () => {
    try {
      const { data } = await axios.get(URI + "/api/user/logout", {
        withCredentials: true,
      });
      if (data.success) {
        setUser(null);
        setIsLoggedIn(false);
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-50 via-white to-green-100 border-b shadow-sm w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <img src={assets.logo} alt="Logo" className="h-9" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {!user && (
              <Link
                to="/admin"
                className="bg-indigo-100 text-indigo-700 px-3 py-1.5 text-sm rounded-full hover:bg-indigo-300 hover:text-indigo-900 transition duration-200 shadow-sm"
              >
                Admin Panel
              </Link>
            )}

            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              All Products
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Contact
            </Link>

            {/* Search Input */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search products..."
                className="rounded-full pl-4 pr-10 py-2 bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <img
                src={assets.search_icon}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 opacity-70"
                alt="search"
              />
            </div>

            {/* Cart Icon */}
            <div
              onClick={() => {
                navigate("/cart");
              }}
              className="relative cursor-pointer"
            >
              <img
                src={assets.nav_cart_icon}
                alt="Cart"
                className="w-6 opacity-70 hover:opacity-100 transition"
              />
              <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {items}
              </span>
            </div>

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-lg cursor-pointer">
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase()}
                </div>

                <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-md w-40 py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-indigo-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logoutUserAccount}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition text-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden focus:outline-none"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        } bg-white border-t`}
      >
        <div className="flex flex-col gap-4 px-6 py-4 text-sm">
          {!user && (
            <Link
              to="/admin"
              className="bg-indigo-100 text-indigo-700 px-3 py-1.5 text-sm rounded-full hover:bg-indigo-300 hover:text-indigo-900 transition duration-200 shadow-sm"
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setOpen(false)}
          >
            All Products
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          {user && isLoggedIn ? (
            <div className="flex items-center gap-4">
              <img
                src={`${URI}/${user.profilePic}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
              />
              <div className="flex flex-col text-sm gap-1">
                <Link to="/profile" onClick={() => setOpen(false)}>
                  My Profile
                </Link>
                <Link to="/orders" onClick={() => setOpen(false)}>
                  My Orders
                </Link>
                <button className="text-left">Logout</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition text-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

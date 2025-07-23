import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [items, setItems] = useState(0);
  const { user, isLoggedIn, setIsLoggedIn, setUser } = useContext(UserContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

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

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${URI}/api/product/search`, {
          params: { name: searchTerm },
        });
        if (data.success) {
          setSearchResults(data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [searchTerm]);

  return (
    <nav className="bg-gradient-to-r from-green-50 via-white to-green-100 border-b shadow-sm w-full z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <img src={assets.logo} alt="Logo" className="h-9" />
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {!user && (
              <Link
                to="/admin"
                className="bg-indigo-100 text-indigo-700 px-3 py-1.5 text-sm rounded-full hover:bg-indigo-300 hover:text-indigo-900 transition duration-200 shadow-sm"
              >
                Admin Panel
              </Link>
            )}
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-indigo-600"
            >
              All Products
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => searchTerm && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                placeholder="Search products..."
                className="rounded-full pl-4 pr-10 py-2 bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <img
                src={assets.search_icon}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 opacity-70"
                alt="search"
              />

              {showResults && (
                <ul className="absolute top-11 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 text-sm">
                  {loading ? (
                    <li className="px-4 py-3 text-gray-500 text-center">
                      Searching...
                    </li>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <li
                        key={item._id}
                        onMouseDown={() => {
                          setSearchTerm("");
                          setShowResults(false);
                          navigate(
                            `/products/${item.category.toLowerCase()}/${
                              item._id
                            }`
                          );
                        }}
                        className="flex items-start gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-all duration-150 border-b last:border-none"
                      >
                        <div className="flex-1">
                          <p className="text-gray-800 font-semibold">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-gray-500 italic text-center">
                      🔍 No products found
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Cart */}
            <div
              onClick={() => navigate("/cart")}
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

            {/* User */}
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

            {/* Burger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden focus:outline-none"
            >
              <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        } bg-white border-t`}
      >
        <div className="flex flex-col items-center gap-4 px-6 py-6 text-base text-gray-800">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            All Products
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Contact
          </Link>
          {!user && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="text-indigo-700 font-semibold hover:text-indigo-900 transition-colors duration-200"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

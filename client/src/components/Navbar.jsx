import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { UserContext } from "../context/UserContext.jsx";
import { CartItemContext } from "../context/CartItemContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const navigate = useNavigate();
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);
  const { cartItems } = useContext(CartItemContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const logoutUserAccount = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/user/logout`, {
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
    <nav className="w-full px-5 sm:px-8 lg:px-12 bg-gradient-to-r from-green-50 via-white to-green-100 border-b shadow-md z-50">
      <div className="w-full flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} alt="Green Cart Logo" className="h-10" />
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <Link
              to="/admin"
              className="text-sm text-green-700 font-medium bg-green-100 px-3 py-1.5 rounded-full hover:bg-green-200 hover:text-green-900 shadow-sm"
            >
              Admin Panel
            </Link>
          )}
          <Link to="/" className="text-gray-700 hover:text-green-600">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-green-600">
            All Products
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-600">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-44 sm:w-56 lg:w-64">
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
              className="w-full py-2 pl-4 pr-10 rounded-full text-sm bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
            <img
              src={assets.search_icon}
              alt="Search"
              className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 opacity-70"
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
                          `/products/${item.category.toLowerCase()}/${item._id}`
                        );
                      }}
                      className="flex items-start gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-all duration-150 border-b last:border-none"
                    >
                      <div>
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.category}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-center text-gray-500 italic">
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
              {cartItems
                ? cartItems.reduce((total, item) => total + item.quantity, 0)
                : 0}
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
                  className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-indigo-700 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                <button
                  onClick={logoutUserAccount}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm transition"
            >
              Login
            </button>
          )}

          {/* Burger Menu */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden focus:outline-none"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        } bg-white border-t`}
      >
        <div className="flex flex-col items-center gap-4 px-6 py-6 text-base text-gray-800">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="hover:text-gray-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="hover:text-green-600"
          >
            All Products
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="hover:text-indigo-600"
          >
            Contact
          </Link>
          {!user && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="text-green-700 font-medium hover:text-green-900"
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

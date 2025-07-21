import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminNavbar = () => {
  const { admin, setAdmin, setIsAdminLoggedIn } = useContext(AdminContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const logoutAdmin = async () => {
    try {
      const { data } = await axios.get(URI + "/api/admin/logout", {
        withCredentials: true,
      });

      if (data.success) {
        setAdmin(null);
        setIsAdminLoggedIn(false);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Logo + Admin Panel Badge */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={assets.logo} alt="Logo" className="h-9 w-auto" />
        </Link>
        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow hover:shadow-md transition">
          Admin Panel
        </span>
      </div>

      {/* Welcome Message + Admin Name + Logout */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end text-right">
          <p className="text-sm sm:text-base font-semibold text-indigo-700">
            👋 Welcome Admin
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
            {admin}
          </p>
        </div>

        <button
          onClick={logoutAdmin}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm px-5 py-2 rounded-full hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;

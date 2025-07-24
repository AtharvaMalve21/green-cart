import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets.js";
import { Link } from "react-router-dom";

const AdminNav = () => {
  const { setAdmin, setIsAdminLoggedIn } = useContext(AdminContext);
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
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };


  return (
    <>
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to={"/admin"}>
          <img className="h-9" src={assets.logo} alt="dummyLogoColored" />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button
            onClick={logoutAdmin}
            className="border border-green-400 hover:border-green-600 bg-green-50 text-green-700 hover:text-white hover:bg-green-500 rounded-full text-sm px-4 py-1 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminNav;

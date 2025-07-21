import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext({});

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchAdminProfileDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/admin/profile", {
        withCredentials: true,
      });

      if (data.success) {
        setAdmin(data.data);
        setIsAdminLoggedIn(true);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Admin auth check failed");
    } finally {
      setLoading(false); // ✅ Mark loading as complete
    }
  };

  useEffect(() => {
    fetchAdminProfileDetails();
  }, [isAdminLoggedIn]);

  const value = {
    admin,
    setAdmin,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    loading, // ✅ Expose loading
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

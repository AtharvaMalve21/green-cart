import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Products from "./pages/Products.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Contact from "./pages/Contact.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import Cart from "./pages/Cart.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminLoginPanel from "./pages/admin/AdminLoginPanel.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import ProtectedUserRoute from "./pages/user/ProtectedUserRoute.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";

const App = () => {
  return (
    <>
      <GlobalLoader />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <MyProfile />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedUserRoute>
                <MyOrders />
              </ProtectedUserRoute>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="/admin-login" element={<AdminLoginPanel />} />
      </Routes>
    </>
  );
};

export default App;

import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/user/Login.jsx";
import Signup from "./pages/user/Signup.jsx";
import MyProfile from "./pages/user/MyProfile.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Contact from "./pages/Contact.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminLoginPanel from "./pages/admin/AdminLoginPanel.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import ProtectedUserRoute from "./pages/user/ProtectedUserRoute.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import NotFound from "./pages/NotFound.jsx";
import Footer from "./components/Footer.jsx";
import { AdminContext } from "./context/AdminContext.jsx";
import MyOrders from "./pages/user/MyOrders.jsx";
import ProductList from "./pages/admin/ProductList.jsx";
import OrderList from "./pages/admin/OrderList.jsx";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const { admin } = useContext(AdminContext);
  const hideFooterRoutes = ["/admin-login"];
  const shouldShowFooter =
    !admin && !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <GlobalLoader />
      <Routes>
        <Route path="*" element={<NotFound />} />
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
            path="/my-orders"
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
          {/* <Route path="add-product" element={<AddProduct />} /> */}
          <Route path="product-list" element={<ProductList />} />
          <Route path="order-list" element={<OrderList />} />
        </Route>
        <Route path="/admin-login" element={<AdminLoginPanel />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
};

export default App;

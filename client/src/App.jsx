import React from "react";
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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:category" element={<ProductCategory />} />
        <Route path="/products/:category/:id" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<MyOrders />} />
      </Route>
    </Routes>
  );
};

export default App;

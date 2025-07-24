// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminSidebar = () => {
  const location = useLocation();

  const icons = {
    addIcon: assets.add_icon,
    product_listIcon: assets.product_list_icon,
    orderIcon: assets.order_icon,
  };

  const sidebarLinks = [
    { name: "Add Product", path: "/admin", icon: icons.addIcon },
    {
      name: "Product List",
      path: "/admin/product-list",
      icon: icons.product_listIcon,
    },
    { name: "Orders", path: "/admin/order-list", icon: icons.orderIcon },
  ];

  return (
    <div className="md:w-64 w-16 border-r h-[calc(100vh-60px)] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            to={item.path}
            key={index}
            className={`flex items-center py-3 px-4 gap-3 transition-all duration-200
              ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-green-500/10 border-green-500 text-green-500"
                  : "hover:bg-gray-100/90 border-white text-gray-700"
              }`}
          >
            <img src={item.icon} alt="" />
            <p className="md:block hidden text-center">{item.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;

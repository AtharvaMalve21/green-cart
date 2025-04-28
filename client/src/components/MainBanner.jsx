import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">

      {/* Background Images */}
      <img
        src={assets.main_banner_bg}
        alt=""
        className="w-full px-20 rounded-md h-full object-cover hidden md:block"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt=""
        className="w-full h-full object-cover md:hidden"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-2xl md:text-4xl font-extrabold drop-shadow-md max-w-xl">
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mt-6 font-medium">
          <Link
            to="/products"
            className="group flex items-center justify-center gap-2 px-7 md:px-9 py-3 bg-green-500 hover:bg-green-700 transition rounded-full text-white"
          >
            Shop now
            <img
              className="transition-transform duration-200 group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt=""
            />
          </Link>

          <Link
            to="/products"
            className="group flex items-center justify-center gap-2 px-7 md:px-9 py-3 bg-white hover:bg-gray-200 transition rounded-full text-black"
          >
            Explore deals
            <img
              className="transition-transform duration-200 group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;

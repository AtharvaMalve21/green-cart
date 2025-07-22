import React from "react";
import { assets, features } from "../assets/assets.js";

const BottomBanner = () => {
  return (
    <div className="relative mt-24 w-full max-w-7xl mx-auto overflow-hidden rounded-xl">
      {/* Desktop Banner */}
      <img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block object-cover"
      />

      {/* Mobile Banner */}
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden object-cover"
      />

      {/* Text Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end justify-center p-6 md:p-12">
        <div className=" backdrop-blur-md p-4 md:p-6 rounded-lg max-w-md w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
            Why We Are the Best?
          </h1>

          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 mt-4"
            >
              <img src={feature.icon} alt="" className="w-9 md:w-11 mt-1" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500/70 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;

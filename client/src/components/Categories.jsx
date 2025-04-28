import React from "react";
import { categories } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4 md:px-12 bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
        Shop by Category
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/products/${category.path.toLocaleLowerCase()}`)
            }
            className="cursor-pointer rounded-xl shadow hover:shadow-lg transition duration-300 bg-white overflow-hidden"
          >
            <div
              className="h-32 flex items-center justify-center"
              style={{ backgroundColor: category.bgColor }}
            >
              <img
                src={category.image}
                alt={category.text}
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="text-center py-3 px-2 bg-white">
              <h2 className="text-sm font-semibold text-gray-700">
                {category.text}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

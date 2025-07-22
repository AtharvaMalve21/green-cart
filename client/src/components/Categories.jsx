import React, { useContext } from "react";
import { categories } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

const Categories = () => {
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

  // Create a map of category name => list of products
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-green-700 mb-10">
        Shop by Category
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories
          .filter((category) => groupedProducts[category.path])
          .map((category, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/products/${category.path.toLowerCase()}`)
              }
              className="cursor-pointer group rounded-2xl bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden"
            >
              <div
                className="h-36 sm:h-40 flex items-center justify-center"
                style={{ backgroundColor: category.bgColor }}
              >
                <img
                  src={category.image}
                  alt={category.text}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="bg-lime-50  py-4 px-3 text-center">
                <h2 className="text-base font-semibold text-green-800">
                  {category.text}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {groupedProducts[category.path]?.length} items
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Categories;

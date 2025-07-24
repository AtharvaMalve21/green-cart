import React, { useContext, useEffect } from "react";
import { categories } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

const Categories = () => {
  const navigate = useNavigate();
  const { products, setProducts, allProducts } = useContext(ProductContext);

  // Create a map of category name => list of products
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  useEffect(() => {
    setProducts(allProducts); // show everything when this page loads
  }, [allProducts]);

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl ml-2 sm:text-4xl font-semibold text-gray-700 mb-10">
        Categories 
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories
          .filter((category) => groupedProducts[category.path])
          .map((category, index) => (
            <div
              onClick={() =>
                navigate(`/products/${category.path.toLowerCase()}`)
              }
              key={index}
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
                <h2 className="text-base font-semibold text-gray-600">
                  {category.text}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
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

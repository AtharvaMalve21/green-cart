import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoader } from "../../context/LoaderContext.jsx";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
    images: [],
  });

  const { setLoading } = useLoader();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...productData.images];
      updatedImages[index] = file;
      setProductData({ ...productData, images: updatedImages });
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.id]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.price || !productData.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("price", productData.price);
    formData.append("offerPrice", productData.offerPrice);

    productData.images.forEach((img, i) => {
      if (img) formData.append("images", img);
    });

    try {
      setLoading(true);
      const { data } = await axios.post(URI + "/api/product/add", formData, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        setProductData({
          name: "",
          description: "",
          category: "",
          price: "",
          offerPrice: "",
          images: [],
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add product. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={addProduct} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      productData.images[index]
                        ? URL.createObjectURL(productData.images[index])
                        : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                    }
                    alt="upload"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            value={productData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={productData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {[
              "Vegetables",
              "Fruits",
              "Drinks",
              "Instant",
              "Dairy",
              "Bakery",
              "Grains",
            ].map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offerPrice"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={productData.offerPrice}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

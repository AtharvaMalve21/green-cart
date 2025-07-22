import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";

import axios from "axios";
import { toast } from "react-hot-toast";
import { ProductContext } from "../context/ProductContext";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  
  const { setProducts } = useContext(ProductContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/product");
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div className="mt-10">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  );
};

export default Home;

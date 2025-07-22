import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const ProductContext = createContext({});

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

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
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

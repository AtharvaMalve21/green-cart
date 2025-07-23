import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLoader } from "./LoaderContext";

export const ProductContext = createContext({});

export const ProductContextProvider = ({ children }) => {

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const { setLoading } = useLoader();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(URI + "/api/product");

      if (data.success) {
        setAllProducts(data.data);
        setProducts(data.data); // initial visible products
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <ProductContext.Provider
      value={{ allProducts, products, setProducts, setAllProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

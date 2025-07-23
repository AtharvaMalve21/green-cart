import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";

export const CartItemContext = createContext({});

export const CartItemContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  // ------------------ Helpers ------------------

  const saveCartToLocalStorage = (items) => {
    localStorage.setItem("guest_cart", JSON.stringify(items));
  };

  const getCartFromLocalStorage = () => {
    try {
      const items = localStorage.getItem("guest_cart");
      return items ? JSON.parse(items) : [];
    } catch (e) {
      return [];
    }
  };

  // ------------------ Fetch Cart ------------------

  const fetchCartDetails = async () => {
    if (user) {
      try {
        const { data } = await axios.get(`${URI}/api/cart`, {
          withCredentials: true,
        });
        console.log(data);
        if (data.success) {
          setCartItems(data.data);
        }
      } catch (err) {
        console.log(err.message)
        console.log(err?.response?.data?.message);
      }
    } else {
      const localCart = getCartFromLocalStorage();
      setCartItems(localCart);
    }
  };

  // ------------------ Add to Cart ------------------

  const addToCart = async (productId, quantity = 1) => {
    if (user) {
      try {
        const { data } = await axios.post(
          `${URI}/api/cart/${productId}`,
          { quantity },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (data.success) {
          toast.success(data.message);
          await fetchCartDetails();
        }
      } catch (err) {
        console.log(err?.response?.data?.message);
        toast.error(err?.response?.data?.message || "Failed to add to cart");
      }
    } else {
      // For guest (not logged in)
      const localCart = getCartFromLocalStorage();
      const itemIndex = localCart.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        localCart[itemIndex].quantity += quantity;
      } else {
        localCart.push({ productId, quantity });
      }

      saveCartToLocalStorage(localCart);
      setCartItems(localCart);
      toast.success("Item added to cart!");
    }
  };

  // ------------------ Init ------------------

  useEffect(() => {
    fetchCartDetails();
  }, [user]);

  return (
    <CartItemContext.Provider
      value={{ cartItems, setCartItems, fetchCartDetails, addToCart }}
    >
      {children}
    </CartItemContext.Provider>
  );
};

import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLoader } from "./LoaderContext";

export const CartItemContext = createContext({});

export const CartItemContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const { setLoading } = useLoader();

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
        if (data.success) {
          setCartItems(data.data); // This already contains full product data for logged-in users
        }
      } catch (err) {
        console.log(err.message);
        console.log(err?.response?.data?.message);
      }
    } else {
      const localCart = getCartFromLocalStorage();

      // If empty, don't fetch anything
      if (localCart.length === 0) {
        setCartItems([]);
        return;
      }

      try {
        const productIds = localCart.map((item) => item.productId);

        // Make a single request to get details for all products
        const { data } = await axios.post(`${URI}/api/product/by-ids`, {
          productIds,
        });

        if (data.success) {
          const mergedCart = localCart
            .map((item) => {
              const product = data.data.find((p) => p._id === item.productId);
              return product ? { ...product, quantity: item.quantity } : null;
            })
            .filter(Boolean);

          setCartItems(mergedCart);
        }
      } catch (error) {
        console.error("Error fetching product details for guest cart:", error);
      }
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
      toast.success("Item added to cart!");

      // 🔁 Fetch full product data after local update
      await fetchCartDetails(); // ✅
    }
  };

  // ------------------ Remove From Cart ------------------
  const removeItemFromCart = async (productId) => {
    try {
      setLoading(true);

      if (user) {
        const { data } = await axios.delete(`${URI}/api/cart/${productId}`, {
          withCredentials: true,
        });

        if (data.success) {
          const updatedCart = cartItems.filter(
            (item) => item._id !== productId
          );
          setCartItems(updatedCart);
          fetchCartDetails();
          toast.success(data.message);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

        const updatedCart = localCart.filter(
          (item) => item.productId !== productId
        );

        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

        fetchCartDetails();
        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UPDATE QUANTITY ------------------
  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      // 🔁 Handle Guest User
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

      const updatedCart = guestCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

      // ✅ Refetch full product info
      await fetchCartDetails();

      toast.success("Quantity updated!");
      return;
    }

    // 🔐 Handle Logged-In User
    try {
      const { data } = await axios.put(
        `${URI}/api/cart`,
        { productId, quantity },
        { withCredentials: true }
      );

      if (data.success) {
        const updatedCart = cartItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);

        fetchCartDetails(); // Optional resync
      }
    } catch (err) {
      console.log(err.response?.data?.message);
      toast.error("Failed to update quantity");
    }
  };


  useEffect(() => {
    fetchCartDetails();
  }, [user]);

  return (
    <CartItemContext.Provider
      value={{
        cartItems,
        setCartItems,
        fetchCartDetails,
        addToCart,
        removeItemFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
};

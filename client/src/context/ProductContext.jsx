import { createContext, useState } from "react";

export const ProductContext = createContext({});

export const ProductContextProvider = ({ children }) => {
  const [items, setItems] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const value = {
    items,
    setItems,
    cartItems,
    setCartItems,
    totalPrice,
    setTotalPrice,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

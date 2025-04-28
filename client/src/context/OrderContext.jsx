import { createContext, useState } from "react";

export const OrderContext = createContext({});

export const OrderContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  return (
    <OrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

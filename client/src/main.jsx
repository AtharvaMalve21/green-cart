import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext.jsx";
import { ProductContextProvider } from "./context/ProductContext.jsx";
import { OrderContextProvider } from "./context/OrderContext.jsx";
import { MessageContextProvider } from "./context/MessageContext.jsx";
import { AdminContextProvider } from "./context/AdminContext.jsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LoaderContextProvider } from "./context/LoaderContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <ProductContextProvider>
        <OrderContextProvider>
          <MessageContextProvider>
            <AdminContextProvider>
              <LoaderContextProvider>
                <App />
              </LoaderContextProvider>
            </AdminContextProvider>
          </MessageContextProvider>
        </OrderContextProvider>
      </ProductContextProvider>
    </UserContextProvider>
    <Toaster />
  </BrowserRouter>
);

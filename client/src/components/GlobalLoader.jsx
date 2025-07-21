// components/GlobalLoader.jsx
import { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";

const GlobalLoader = () => {
  const { loading } = useContext(LoaderContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default GlobalLoader;

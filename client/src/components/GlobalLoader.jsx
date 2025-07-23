// components/GlobalLoader.jsx
import { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";

const GlobalLoader = () => {
  const { loading } = useContext(LoaderContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-14 w-14 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
        <p className="text-white text-sm font-medium tracking-wide animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;

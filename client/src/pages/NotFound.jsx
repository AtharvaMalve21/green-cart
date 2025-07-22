import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-6 py-12">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-green-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

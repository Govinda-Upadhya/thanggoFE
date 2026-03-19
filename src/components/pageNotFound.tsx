import React from "react";
import { Link } from "react-router-dom"; // if you're using react-router

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-center px-6">
      <h1 className="text-9xl font-extrabold text-emerald-500 tracking-widest">
        404
      </h1>
      <div className="bg-emerald-500 text-white px-3 py-1 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>

      <p className="mt-6 text-gray-600 text-lg max-w-md">
        Oops! The page you’re looking for doesn’t exist. It might have been
        moved or deleted.
      </p>

      <div className="mt-8">
        <Link
          to="/"
          className="px-6 py-3 text-white bg-emerald-500 rounded-lg shadow-md hover:bg-emerald-600 transition duration-300 ease-in-out"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

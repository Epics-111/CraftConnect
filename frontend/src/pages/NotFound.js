import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";

const NotFound = () => {
  const isLoggedIn = localStorage.getItem("token") !== null;
  const homePath = isLoggedIn ? "/dashboard" : "/";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg">
        <div className="mb-6">
          <div className="text-red-500 text-8xl font-bold mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to={homePath} className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full">
            <FaHome className="mr-2" />
            Back to Home
          </Link>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => window.history.back()} 
              className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
            
            <Link 
              to="/services" 
              className="flex-1 flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaSearch className="mr-2" />
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
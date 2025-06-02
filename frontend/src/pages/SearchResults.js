import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import ServiceCard from "../components/ServiceCard";
import { apiRequest } from "../api";

const SearchResults = () => {
  const { query } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest(`/api/services/service/title/${query}`);
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
        setLoading(false);
        console.error("Error fetching search results:", err);
      }
    };

    if (query) {
      fetchServices();
    }
  }, [query]);

  return (
    <>
      <Header />
      
      {/* Search Bar Section */}
      <SearchBar initialQuery={query} />
      
      {/* Search Results Content */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for "{query}"...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search Results Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Search Results
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  Results for: <span className="font-semibold text-blue-600">"{query}"</span>
                </p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {services.length} {services.length === 1 ? 'service' : 'services'} found
                  </span>
                </div>
              </div>

              {/* Search Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.length === 0 ? (
                  <div className="col-span-full">
                    <div className="bg-white shadow-lg rounded-lg p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No services found for "{query}"
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try searching with different keywords or browse our categories below.
                      </p>
                      
                      {/* Search Suggestions */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Try searching for:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {['plumbing', 'electrical', 'cleaning', 'painting', 'gardening', 'carpentry'].map((suggestion) => (
                            <Link
                              key={suggestion}
                              to={`/search/${suggestion}`}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                            >
                              {suggestion}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-x-4">
                        <Link 
                          to="/services" 
                          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Browse All Services
                        </Link>
                        <Link 
                          to="/" 
                          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Back to Home
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  services.map((service) => (
                    <ServiceCard 
                      key={service._id} 
                      service={service}
                      className="grid-view"
                    />
                  ))
                )}
              </div>

              {/* Related Categories Section */}
              {services.length > 0 && (
                <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Related Categories
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['plumbing', 'electrical', 'cleaning', 'painting', 'gardening', 'carpentry'].map((category) => (
                      <Link
                        key={category}
                        to={`/search/${category}`}
                        className="p-3 text-center bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <div className="font-medium capitalize">{category}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section for Search Results */}
              <div className="mt-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
                <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                  Our AI-powered chatbot can help you find the perfect service provider for your specific needs.
                </p>
                <button 
                  className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                  onClick={() => {
                    // This will open the chatbot widget if it exists
                    const chatButton = document.querySelector('.chat-toggle-button');
                    if (chatButton) {
                      chatButton.click();
                    }
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with Assistant
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import ServiceCard from "../components/ServiceCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(12); // Show 12 services per page
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/all`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
        setLoading(false);
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  // Calculate pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(services.length / servicesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of services section
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <>
        <Header />
        <SearchBar />
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4">
            <SkeletonLoader type="serviceGrid" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Search Bar Section */}
      <SearchBar />
      
      {/* Services Content */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {error ? (
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
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
              {/* Header Section */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover professional services from verified providers in your area
                </p>
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500 gap-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {services.length} total services
                  </span>
                  {totalPages > 1 && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {services.length === 0 ? (
                  <div className="col-span-full">
                    <div className="bg-white shadow-lg rounded-lg p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
                      <p className="text-gray-600 mb-4">We're currently adding new services. Please check back soon!</p>
                      <Link 
                        to="/" 
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Browse Categories
                      </Link>
                    </div>
                  </div>
                ) : (
                  currentServices.map((service) => (
                    <ServiceCard 
                      key={service._id} 
                      service={service}
                      className="grid-view"
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mb-8">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                    }`}
                  >
                    <FaChevronLeft className="mr-1" size={12} />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="px-2 py-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 py-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                    }`}
                  >
                    Next
                    <FaChevronRight className="ml-1" size={12} />
                  </button>
                </div>
              )}

              {/* Services per page info */}
              {services.length > 0 && (
                <div className="text-center text-sm text-gray-500 mb-8">
                  Showing {indexOfFirstService + 1} to {Math.min(indexOfLastService, services.length)} of {services.length} services
                </div>
              )}

              {/* CTA Section */}
              {services.length > 0 && (
                <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
                  <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Can't find what you're looking for? Our team can help you find the right professional for any job.
                  </p>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  >
                    Contact Us
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceList;
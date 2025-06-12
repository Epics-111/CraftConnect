import React from "react";

const SkeletonLoader = ({ type }) => {
  if (type === "profile") {
    return (
      <div className="user-profile-container animate-pulse">
        <div className="profile-header" style={{ background: "#e5e7eb" }}>
          <div className="profile-avatar" style={{ background: "#d1d5db" }}></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
        
        <div className="profile-tabs">
          <div className="tab w-1/2" style={{ background: "#f3f4f6" }}></div>
          <div className="tab w-1/2" style={{ background: "#f3f4f6" }}></div>
        </div>
        
        <div className="profile-form-container">
          {[1, 2].map((section) => (
            <div key={section} className="form-section">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              {[1, 2, 3].map((field) => (
                <div key={field} className="form-group">
                  <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "bookingHistory") {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            {/* Header section */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {/* Service title */}
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                {/* Date */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                {/* Status */}
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                {/* Instructions */}
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
              
              {/* Status badge */}
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <div className="h-9 bg-blue-200 rounded-lg w-36"></div>
              <div className="h-9 bg-red-200 rounded-lg w-32"></div>
            </div>

            {/* Price section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "serviceDetails") {
    return (
      <div className="animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600" style={{ height: "400px" }}>
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            {/* Back button */}
            <div className="self-start mb-6">
              <div className="h-10 bg-white bg-opacity-20 rounded-lg w-32"></div>
            </div>
            
            {/* Service GIF placeholder */}
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full mb-6"></div>
            
            {/* Title */}
            <div className="h-12 bg-white bg-opacity-20 rounded w-80 mb-4"></div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 bg-white bg-opacity-20 rounded w-32"></div>
              <div className="h-6 bg-white bg-opacity-20 rounded w-20"></div>
            </div>
            
            {/* Description */}
            <div className="h-6 bg-white bg-opacity-20 rounded w-96"></div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Service Details Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-5 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* What's Included */}
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-4 bg-gray-100 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                
                {/* Provider Avatar and Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((contact) => (
                    <div key={contact} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-5 bg-gray-300 rounded w-28"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((stat) => (
                  <div key={stat} className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded mb-3"></div>
                    <div className="h-5 bg-white bg-opacity-20 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-white bg-opacity-30 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                
                {/* Calendar placeholder */}
                <div className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-48 bg-gray-100 rounded"></div>
                </div>
                
                {/* Form fields */}
                <div className="space-y-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-20 bg-gray-100 rounded"></div>
                  </div>
                  
                  {/* Book button */}
                  <div className="h-12 bg-green-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((trust) => (
                <div key={trust} className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default SkeletonLoader;
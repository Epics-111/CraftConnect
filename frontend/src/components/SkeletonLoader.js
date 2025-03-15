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
  
  return null;
};

export default SkeletonLoader;
import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service, showPrice = true, className = "" }) => {
  // Helper function for price formatting
  const formatPrice = (priceObj) => {
    if (!priceObj) return "N/A";
    
    if (priceObj.$numberDecimal) {
      return `₹${parseFloat(priceObj.$numberDecimal).toFixed(2)}`;
    }
    
    if (typeof priceObj === 'number') {
      return `₹${priceObj.toFixed(2)}`;
    }
    
    return "Contact for pricing";
  };

  return (
    <div className={`service-card ${className}`}>
      <div className="service-card-content">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">{service.description}</p>
        
        <div className="service-provider">
          <span className="provider-label">Provider:</span>
          <span className="provider-name">{service.provider_name}</span>
        </div>
        
        {showPrice && (
          <div className="service-price">
            <span className="price-label">Starting from:</span>
            <span className="price-value">{formatPrice(service.price)}</span>
          </div>
        )}
        
        <div className="service-actions">
          <Link
            to={`/service/${service._id}`}
            className="view-details-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
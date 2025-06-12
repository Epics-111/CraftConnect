import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service, showPrice = true, className = "" }) => {
  // Service icon mapping using same Flaticon GIFs as Dashboard
  const getServiceIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('plumb')) return "https://cdn-icons-gif.flaticon.com/8629/8629461.gif";
    if (titleLower.includes('electric')) return "https://cdn-icons-gif.flaticon.com/10607/10607595.gif";
    if (titleLower.includes('clean')) return "https://cdn-icons-gif.flaticon.com/10053/10053408.gif";
    if (titleLower.includes('paint')) return "https://cdn-icons-gif.flaticon.com/8629/8629609.gif";
    if (titleLower.includes('garden')) return "https://cdn-icons-gif.flaticon.com/8485/8485595.gif";
    if (titleLower.includes('carpen')) return "https://cdn-icons-gif.flaticon.com/8629/8629619.gif";
    if (titleLower.includes('cook') || titleLower.includes('chef')) return "https://cdn-icons-gif.flaticon.com/10053/10053388.gif";
    if (titleLower.includes('baby')) return "https://cdn-icons-gif.flaticon.com/15745/15745115.gif";
    if (titleLower.includes('repair')) return "https://cdn-icons-gif.flaticon.com/8629/8629195.gif";
    if (titleLower.includes('tutor') || titleLower.includes('teach')) return "https://cdn-icons-gif.flaticon.com/18844/18844182.gif";
    if (titleLower.includes('photo')) return "https://cdn-icons-gif.flaticon.com/10053/10053386.gif";
    if (titleLower.includes('laundry')) return "https://cdn-icons-gif.flaticon.com/10053/10053384.gif";
    if (titleLower.includes('home') || titleLower.includes('house')) return "https://cdn-icons-gif.flaticon.com/10053/10053408.gif";
    // Default icon for unmatched services
    return "https://cdn-icons-gif.flaticon.com/8629/8629195.gif";
  };

  const formatPrice = (priceObj) => {
    if (!priceObj) return "Contact for pricing";
    if (priceObj.$numberDecimal) {
      return `₹${parseFloat(priceObj.$numberDecimal).toFixed(0)}`;
    }
    if (typeof priceObj === 'number') {
      return `₹${priceObj.toFixed(0)}`;
    }
    return "Contact for pricing";
  };

  return (
    <div className={`service-card-traced ${className}`}>
      {/* Tracing Border Effect */}
      <div className="tracing-border">
        <div className="trace-line trace-top"></div>
        <div className="trace-line trace-right"></div>
        <div className="trace-line trace-bottom"></div>
        <div className="trace-line trace-left"></div>
      </div>
      
      {/* Card Content */}
      <div className="card-content-traced">
        {/* Header with Icon and Title */}
        <div className="service-header-traced">
          <div className="service-icon-traced">
            <img 
              src={getServiceIcon(service.title)} 
              alt={service.title}
              className="icon-gif"
            />
          </div>
          <div className="title-section-traced">
            <h3 className="service-title-traced">{service.title}</h3>
            {showPrice && (
              <div className="price-tag-traced">
                {formatPrice(service.price)}
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="service-description-traced">
          <p>{service.description}</p>
        </div>
        
        {/* Provider Info */}
          <div className="provider-section-traced">
            <div className="provider-avatar-traced">
              {service.provider_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="provider-name-traced">
              {service.provider_name || 'Unknown Provider'}
            </span>
          </div>
          
          {/* Action Button */}
        <Link to={`/service/${service._id}`} className="explore-btn-traced">
          <span>View Details</span>
          <div className="btn-arrow-traced">→</div>
        </Link>
      </div>
      
      {/* Subtle glow effect */}
      <div className="card-glow-traced"></div>
    </div>
  );
};

export default ServiceCard;
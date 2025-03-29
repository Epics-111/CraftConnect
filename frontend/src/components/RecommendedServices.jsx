import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RecommendedServices.css';

const RecommendedServices = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData._id) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/recommendations/${userData._id}`
        );
        
        setRecommendations(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Unable to load recommendations");
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);

  // Format price correctly
  const formatPrice = (price) => {
    if (!price) return "N/A";
    
    if (price.$numberDecimal) {
      return `$${parseFloat(price.$numberDecimal).toFixed(2)}/hr`;
    }
    
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}/hr`;
    }
    
    return "N/A";
  };

  if (loading) return <div className="recommendation-loading">Loading recommendations...</div>;
  if (error) return null; // Don't show errors to user, just hide component
  if (!recommendations.length) return null;

  return (
    <div className="recommended-services">
      <h2 className="section-title">Recommended for You</h2>
      <div className="recommendations-grid">
        {recommendations.map(service => (
          <Link 
            to={`/service/${service._id}`} 
            key={service._id}
            className="recommendation-card"
          >
            <h3>{service.title}</h3>
            <p className="recommendation-price">{formatPrice(service.price)}</p>
            <p className="recommendation-provider">{service.provider_name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedServices;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NearbyServices.css';
import ServiceCard from './ServiceCard';

const NearbyServices = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyServices(latitude, longitude, radius);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to access your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, [radius]);

  const fetchNearbyServices = async (lat, lng, radius) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/services/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      setNearbyServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nearby services:", error);
      setError("Failed to fetch nearby services. Please try again.");
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Finding services near you...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;

  // Create OpenStreetMap URL with user location and marker
  const mapUrl = userLocation ?
    `https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.02}%2C${userLocation.lat - 0.02}%2C${userLocation.lng + 0.02}%2C${userLocation.lat + 0.02}&layer=mapnik&marker=${userLocation.lat}%2C${userLocation.lng}` :
    '';

  return (
    <div className="nearby-services-container">
      <div className="controls-container">
        <div className="radius-selector">
          <label htmlFor="radius-slider">Search Radius: {radius} km</label>
          <input
            type="range"
            id="radius-slider"
            min="1"
            max="20"
            value={radius}
            onChange={handleRadiusChange}
            className="radius-slider"
          />
        </div>
        <p className="services-found">Found {nearbyServices.length} services within {radius}km of your location</p>
      </div>

      <div className="services-map-container">
        <div className="map-container">
          {userLocation && (
            <iframe
              title="OpenStreetMap"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={mapUrl}
            ></iframe>
          )}
        </div>

        <div className="services-list">
          {nearbyServices.length === 0 ? (
            <p>No services found in your area. Try increasing the search radius.</p>
          ) : (
            <div className="services-scroll-wrapper">
              <div className="services-grid">
                {nearbyServices.map((service) => (
                  <ServiceCard 
                    key={service._id} 
                    service={service}
                    className="nearby-card"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyServices;
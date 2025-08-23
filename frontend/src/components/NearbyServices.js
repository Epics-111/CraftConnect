import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NearbyServices.css';
import ServiceCard from './ServiceCard';

// Add Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon paths (necessary for many bundlers)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// add after default icon mergeOptions (or near top of file)
const userIcon = L.divIcon({
  className: 'user-marker-icon',
  html: `<svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" fill="#ff2a00ff"/>
           <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
         </svg>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const NearbyServices = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5);

  useEffect(() => {
    // Get user's location once, then fetch services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyServices(latitude, longitude, radius);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to access your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
    // run only once on mount; when radius changes we'll call fetch separately below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch when radius changes and we already have userLocation
  useEffect(() => {
    if (userLocation) {
      setLoading(true);
      fetchNearbyServices(userLocation.lat, userLocation.lng, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius]);

  const fetchNearbyServices = async (lat, lng, radius) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/services/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      setNearbyServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching nearby services:", err);
      setError("Failed to fetch nearby services. Please try again.");
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    setRadius(Number(e.target.value));
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Finding services near you...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;

  // helper: try common places to get lat/lng from service object
  const getServiceLatLng = (service) => {
    if (!service) return null;
    if (service.location && Array.isArray(service.location.coordinates)) {
      // GeoJSON style: [lng, lat]
      const [lng, lat] = service.location.coordinates;
      return [lat, lng];
    }
    if (service.latitude !== undefined && service.longitude !== undefined) {
      return [service.latitude, service.longitude];
    }
    if (service.lat !== undefined && service.lng !== undefined) {
      return [service.lat, service.lng];
    }
    if (service.coordinates && Array.isArray(service.coordinates)) {
      // maybe [lat, lng]
      const [a, b] = service.coordinates;
      if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return [a, b];
    }
    return null;
  };

  // small component to center map on user when available
  const Recenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [0, 0];

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
        <div className="map-container" style={{ height: 400 }}>
          {userLocation && (
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <Recenter center={mapCenter} />
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* user marker */}
              <Marker position={mapCenter} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {/* service markers */}
              {nearbyServices.map((service) => {
                const pos = getServiceLatLng(service);
                if (!pos) return null;
                return (
                  <Marker key={service._id} position={pos}>
                    <Popup>
                      <strong>{service.name || service.title || 'Service'}</strong>
                      <div>{service.description || service.address || ''}</div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
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
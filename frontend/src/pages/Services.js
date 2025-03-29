import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaWrench, 
  FaBolt, 
  FaBroom, 
  FaBabyCarriage, 
  FaPaintRoller,
  FaHammer,
  FaHardHat,
  FaTools,
  FaLeaf,
  FaLaptopCode,
  FaPaw,
  FaTruck
} from "react-icons/fa";
import "./Services.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Service icon mapping - similar to Dashboard but expanded
  const serviceIconMap = {
    "Plumbing": <FaWrench className="service-icon" />,
    "Electrician": <FaBolt className="service-icon" />,
    "Electrical": <FaBolt className="service-icon" />,
    "Electrical Repair": <FaBolt className="service-icon" />,
    "House Cleaning": <FaBroom className="service-icon" />,
    "Cleaning": <FaBroom className="service-icon" />,
    "Babysitting": <FaBabyCarriage className="service-icon" />,
    "Painting": <FaPaintRoller className="service-icon" />,
    "Carpentry": <FaHammer className="service-icon" />,
    "Carpentry Work": <FaHammer className="service-icon" />,
    "Construction": <FaHardHat className="service-icon" />,
    "Gardening": <FaLeaf className="service-icon" />,
    "Gardening Services": <FaLeaf className="service-icon" />,
    "Computer Repair": <FaLaptopCode className="service-icon" />,
    "Pet Care": <FaPaw className="service-icon" />,
    "Moving Service": <FaTruck className="service-icon" />,
    "default": <FaTools className="service-icon" />
  };

  // Helper function to get an appropriate icon based on service name
  const getServiceIcon = (title) => {
    // Check if the title contains any of our known service types
    const matchedKey = Object.keys(serviceIconMap).find(key => 
      title.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchedKey ? serviceIconMap[matchedKey] : serviceIconMap.default;
  };

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

  // Helper function for price formatting
  const formatPrice = (priceObj) => {
    if (!priceObj) return "N/A";
    
    if (priceObj.$numberDecimal) {
      return `$${parseFloat(priceObj.$numberDecimal).toFixed(2)}/hr`;
    }
    
    if (typeof priceObj === 'number') {
      return `$${priceObj.toFixed(2)}/hr`;
    }
    
    return "N/A";
  };

  return (
    <>
      <Header />
      {loading ? (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <p className="text-center">Loading services...</p>
        </div>
      ) : error ? (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <p className="text-center text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto block hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-center">Our Services</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.length === 0 ? (
              <p className="text-center col-span-2">No services available at the moment.</p>
            ) : (
              services.map((service) => (
                <div key={service._id} className="p-4 border rounded-lg shadow-md flex">
                  <div className="service-icon-container mr-4 flex-shrink-0">
                    {getServiceIcon(service.title)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-gray-600 mt-2">{service.description}</p>
                    <p className="mt-2 font-bold">Price: {formatPrice(service.price)}</p>
                    <Link
                      to={`/service/${service._id}`}
                      className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ServiceList;
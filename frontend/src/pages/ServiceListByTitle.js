import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiRequest } from "../api";

const ServiceListByTitle = () => {
  const { title } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiRequest(`/api/services/service/title/${title}`);
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      }
    };

    fetchServices();
  }, [title]);

  const formatPrice = (price) => {
    return price && price.$numberDecimal ? `$${price.$numberDecimal}` : "N/A";
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        {loading ? (
          <p className="text-center">Loading services...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-center">Services for {title}</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.length === 0 ? (
                <p className="text-center col-span-2">No services available at the moment.</p>
              ) : (
                services.map((service) => (
                  <div key={service._id} className="p-4 border rounded-lg shadow-md">
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
                ))
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ServiceListByTitle;
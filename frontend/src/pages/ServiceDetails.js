import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    client_name: "",
    client_email: "",
    booking_date: "",
  });

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/services/service/${id}`);
        const serviceData = response.data;
        serviceData.price = serviceData.price.$numberDecimal;
        setService(serviceData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("API URL:", process.env.REACT_APP_API_URL);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings/create`, {
        service: id,
        ...bookingData
      });
      
      if (response.status === 201) {
        alert("Booking successful!");
        setShowBookingForm(false);
      }
    } catch (err) {
      console.error("Booking error:", err.response ? err.response.data : err.message);
      alert("Failed to create booking. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10">Error: {error}</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center">{service.title}</h2>
        <p className="mt-4 text-gray-600">{service.description}</p>
        <p className="mt-2 font-bold">Price: ${service.price}</p>
        <p className="mt-2">Provided by: {service.provider_name}</p>
        <p className="mt-1">Contact: {service.provider_contact}</p>
        
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showBookingForm ? "Cancel Booking" : "Book Now"}
        </button>

        {showBookingForm && (
          <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="client_name"
                value={bookingData.client_name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="client_email"
                value={bookingData.client_email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="datetime-local"
                name="booking_date"
                value={bookingData.booking_date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
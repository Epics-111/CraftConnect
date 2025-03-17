import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";
import axios from "axios";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Generate time slots for next 7 days, every hour from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      
      // Skip generating slots for today that have already passed
      const startHour = i === 0 ? now.getHours() + 1 : 9;
      
      for (let hour = startHour; hour <= 17; hour++) {
        if (i === 0 && hour < 9) continue; // Skip hours before 9 AM
        if (hour > 17) continue; // Skip hours after 5 PM
        
        date.setHours(hour, 0, 0, 0);
        slots.push(date.toISOString());
      }
    }
    
    return slots;
  };
  
  const [bookingState, setBookingState] = useState({
    showForm: false,
    selectedSlot: null,
    status: null,
    data: {
      client_name: "",
      client_email: "",
      booking_date: "",
      contact_number: "",
      special_instructions: ""
    }
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
      setBookingState(prev => ({ ...prev, status: "Processing..." }));
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        throw new Error("User data not found. Please log in again.");
      }
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings/create`, {
        service: id,
        client_name: userData.name,
        client_email: userData.email,
        booking_date: bookingState.data.booking_date,
        contact_number: bookingState.data.contact_number,
        special_instructions: bookingState.data.special_instructions
      });
      
      if (response.status === 201) {
        setBookingState(prev => ({ 
          ...prev, 
          status: "Booking successful! We'll contact you to confirm.", 
          showForm: false 
        }));
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setBookingState(prev => ({ ...prev, status: null }));
        }, 5000);
      }
    } catch (err) {
      console.error("Booking error:", err.response ? err.response.data : err.message);
      setBookingState(prev => ({ 
        ...prev, 
        status: `Failed to create booking: ${err.response ? err.response.data.message : err.message}`
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value
      }
    }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto mt-10 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto mt-10 p-6">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <p className="mt-2">Unable to load service details. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Service Details</h2>
                <p className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  <span>Location: {service.location ? "Available in your area" : "Remote service"}</span>
                </p>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ₹{service.price}
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Provider Information</h2>
                <p className="font-medium mb-2">{service.provider_name}</p>
                <p className="flex items-center mb-2">
                  <FaPhone className="text-blue-500 mr-2" />
                  <span>{service.provider_contact}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaEnvelope className="text-blue-500 mr-2" />
                  <span>{service.provider_email}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <BookingForm 
              bookingState={bookingState}
              setBookingState={setBookingState}
              onSubmit={handleBookingSubmit}
              onChange={handleInputChange}
              timeSlots={generateTimeSlots()}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceDetail;
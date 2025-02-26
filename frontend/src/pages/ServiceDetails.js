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

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/services/service/${id}`);
        const serviceData = response.data;
        // Convert Decimal128 to string
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
        <p className="mt-2 font-bold">Price: {service.price}</p>
        <p className="mt-2">Provided by: {service.provider_name}</p>
        <p className="mt-1">Contact: {service.provider_contact}</p>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
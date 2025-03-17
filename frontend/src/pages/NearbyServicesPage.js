import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NearbyServices from '../components/NearbyServices';
import { FaMapMarkerAlt } from 'react-icons/fa';

const NearbyServicesPage = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Services Near You</h1>
            <div className="flex items-center justify-center mb-4">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <p className="text-gray-600">Discover top-rated service providers in your area</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <NearbyServices />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NearbyServicesPage;
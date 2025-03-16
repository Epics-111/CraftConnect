import React from 'react';
import StarRating from './StarRating';

const ProviderProfile = ({ provider }) => (
  <div className="max-w-4xl mx-auto mt-10">
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <img 
          src={provider?.avatar || '/default-avatar.png'} 
          alt={provider?.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{provider?.name}</h2>
          <p className="text-gray-600">{provider?.specialization}</p>
          <div className="flex items-center mt-2">
            <StarRating value={provider?.rating || 0} readonly />
            <span className="ml-2">({provider?.reviewCount || 0} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProviderProfile;
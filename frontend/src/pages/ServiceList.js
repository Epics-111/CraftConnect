// import React from "react";

// const ServiceList = () => {
//   const services = [
//     { id: 1, name: "Plumbing", description: "Expert plumbing services for your home and office." },  
//     { id: 2, name: "Electrician", description: "Professional electrical maintenance and installation."},
//     { id: 3, name: "House Cleaning", description: "Reliable and efficient house cleaning services." },
//     { id: 4, name: "Babysitting", description: "Trusted babysitting services for your little ones."},
//   ];

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold text-center">Service Listings</h2>
//       <ul className="mt-4">
//         {services.map((service) => (
//           <li key={service.id} className="p-4 border-b">
//             <h3 className="font-bold text-lg">{service.name}</h3>
//             <p className="text-gray-600">{service.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ServiceList;

const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: mongoose.Types.Decimal128, required: true },
  provider_name: { type: String, required: true, maxlength: 100 },
  provider_contact: { type: Number, required: true },
  provider_email: { type: String, required: true, maxlength: 100 },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
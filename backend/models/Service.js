const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: mongoose.Types.Decimal128, required: true },
  provider_name: { type: String, required: true, maxlength: 100 },
  provider_contact: { type: Number, required: true },
  provider_email: { type: String, required: true, maxlength: 100 },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  }
});

// Add 2dsphere index for geospatial queries
ServiceSchema.index({ location: "2dsphere" });

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  name: { type: String, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  emailHash: {type: String, required: true},              // Deterministic hash for lookup
  password: { type: String, required: true, maxlength: 100 },
  age: { type: Number },
  contact_no: { type: Number },
  role: { type: String, enum: ["consumer", "provider"] },
  providerDetails: {
    serviceType: { type: String },
    experience: { type: Number },
    hourlyRate: { type: mongoose.Types.Decimal128 },
  },
  consumerDetails: {
    address: { type: String },
  },
});

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

const BookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  client_name: { type: String, required: true, maxlength: 100 },
  client_email: { type: String, required: true, maxlength: 100 },
  booking_date: { type: Date, required: true },
  status: { type: String, default: "Pending", maxlength: 100 },
  created_at: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  reviewer_id: { type: Number, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String }
});

const User = mongoose.model("User", UserSchema);
const Service = mongoose.model("Service", ServiceSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const Review = mongoose.model("Review", ReviewSchema);

module.exports = { User, Service, Booking, Review };

const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  client_name: { type: String, required: true, maxlength: 100 },
  client_email: { type: String, required: true, maxlength: 100 },
  booking_date: { type: Date, required: true },
  status: { type: String, default: "Pending", maxlength: 100 },
  created_at: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
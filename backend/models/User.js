const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  emailHash: { type: String, required: true }, // Deterministic hash for lookup
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

const User = mongoose.model("User", UserSchema);
module.exports = User;

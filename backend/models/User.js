const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },  //email that will be encrypted
  emailHash: {type: String, required: true},              // Deterministic hash for lookup
  password: { type: String, required: true },
  profile: {
    name: String,
    careerGoals: String,
    pastEducation: String,
    goals: [String],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
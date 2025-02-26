const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewer_id: { type: Number, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String }
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
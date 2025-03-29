const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['VIEW', 'BOOK', 'SEARCH'],
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  serviceType: String,
  searchQuery: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserActivity', userActivitySchema);
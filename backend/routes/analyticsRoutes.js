const express = require('express');
const router = express.Router();
const UserActivity = require('../models/UserActivity');
const Service = require('../models/Service');
const User = require('../models/User');

// Track user activity
router.post('/track', async (req, res) => {
  try {
    const { userId, activityType, serviceId, searchQuery } = req.body;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If we're tracking a service interaction, get its type
    let serviceType = null;
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) {
        // Extract service type from title (e.g., "Plumbing Services" -> "Plumbing")
        serviceType = service.title.split(' ')[0];
      }
    }
    
    // Create activity record
    const activity = new UserActivity({
      user: userId,
      activityType,
      serviceId,
      serviceType,
      searchQuery
    });
    
    await activity.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ message: 'Error tracking activity' });
  }
});

module.exports = router;
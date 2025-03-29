const express = require('express');
const router = express.Router();
const UserActivity = require('../models/UserActivity');
const Service = require('../models/Service');

// Get personalized recommendations for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userActivities = await UserActivity.find({
      user: userId,
      timestamp: { $gte: thirtyDaysAgo }
    }).sort({ timestamp: -1 }).limit(50);
    
    // If no activities, return popular services
    if (!userActivities.length) {
      const popularServices = await Service.find().limit(5);
      return res.json(popularServices);
    }
    
    // Extract service types the user has shown interest in
    const serviceTypeInterest = {};
    const viewedServiceIds = new Set();
    
    userActivities.forEach(activity => {
      // Track service types
      if (activity.serviceType) {
        serviceTypeInterest[activity.serviceType] = 
          (serviceTypeInterest[activity.serviceType] || 0) + 1;
      }
      
      // Track viewed service IDs to avoid recommending them again
      if (activity.serviceId) {
        viewedServiceIds.add(activity.serviceId.toString());
      }
    });
    
    // Sort service types by interest level
    const sortedInterests = Object.entries(serviceTypeInterest)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // If we have interests, find similar services
    let recommendations = [];
    
    if (sortedInterests.length > 0) {
      // Get services similar to top interests that user hasn't viewed
      for (const serviceType of sortedInterests.slice(0, 3)) {
        const similarServices = await Service.find({
          title: { $regex: serviceType, $options: 'i' },
          _id: { $nin: Array.from(viewedServiceIds) }
        }).limit(3);
        
        recommendations = [...recommendations, ...similarServices];
        
        if (recommendations.length >= 5) break;
      }
    }
    
    // If we still don't have enough recommendations, add some popular services
    if (recommendations.length < 5) {
      const additionalServices = await Service.find({
        _id: { $nin: [...Array.from(viewedServiceIds), ...recommendations.map(s => s._id)] }
      }).limit(5 - recommendations.length);
      
      recommendations = [...recommendations, ...additionalServices];
    }
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
});

module.exports = router;
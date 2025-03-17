const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Create a new service
router.post('/create', async (req, res) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a service by ID
router.put('/update/:id', async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all services
router.get('/all', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get service details by ID
router.get('/service/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Filter and Get services by name
router.get('/service/title/:title', async (req, res) => {
  try {
    const services = await Service.find({ title: { $regex: req.params.title, $options: 'i' } });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby services
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in km
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Convert radius from km to meters
    const radiusInMeters = radius * 1000;
    
    const services = await Service.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      }
    });
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching nearby services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
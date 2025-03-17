// Add this route to your existing services.js file

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
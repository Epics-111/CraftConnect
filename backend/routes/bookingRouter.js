const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service'); // Add this import

// Create a new booking
router.post('/create', async (req, res) => {
  try {
    const { service, client_name, client_email, booking_date } = req.body;
    
    // Validate that the service exists first
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const newBooking = new Booking({
      service,
      client_name,
      client_email,
      booking_date: new Date(booking_date)
    });

    const savedBooking = await newBooking.save();
    
    // Update the service with the new booking
    await Service.findByIdAndUpdate(
      service,
      { $push: { bookings: savedBooking._id } }
    );

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// Get bookings for a service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const bookings = await Booking.find({ service: req.params.serviceId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
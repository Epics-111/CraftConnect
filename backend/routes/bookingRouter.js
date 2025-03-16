const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Create a new booking
router.post('/create', async (req, res) => {
  try {
    const { service, client_name, client_email, booking_date } = req.body;
    console.log('Booking Request:', req.body);

    // Validate that the service exists
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get user from email or create temporary user
    let user = await User.findOne({ email: client_email });
    if (!user) {
      user = new User({
        name: client_name,
        email: client_email,
        role: 'client'
      });
      await user.save();
    }
    
    const newBooking = new Booking({
      service,
      user: user._id,
      client_name,
      client_email,
      booking_date: new Date(booking_date),
      status: 'Pending'
    });

    const savedBooking = await newBooking.save();
    
    // Update service with new booking
    await Service.findByIdAndUpdate(
      service,
      { $push: { bookings: savedBooking._id } }
    );

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create booking', 
      error: error.message 
    });
  }
});

// Get bookings for a service
// router.get('/service/:serviceId', async (req, res) => {
//   try {
//     const bookings = await Booking.find({ service: req.params.serviceId });
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Get booking history for a user
router.get('/history', async (req, res) => {
  try {
    const { client_email } = req.query;
    
    if (!client_email) {
      return res.status(400).json({ message: 'Client email is required' });
    }

    const user = await User.findOne({ email: client_email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await Booking.find({ user: user._id })
      .populate('service')
      .sort({ booking_date: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ message: 'Error fetching booking history' });
  }
});

// Add route for canceling booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking' });
  }
});

module.exports = router;
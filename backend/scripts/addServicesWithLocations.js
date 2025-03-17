require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Services with coordinates around Nagpur, India (21.1458° N, 79.0882° E)
const services = [
  {
    title: 'Emergency Plumbing',
    description: 'Professional plumbing services for emergencies. Available 24/7.',
    price: mongoose.Types.Decimal128.fromString('850.00'),
    provider_name: 'Nagpur Quick Fix Plumbing',
    provider_contact: 9175551234,
    provider_email: 'service@nagpurplumbing.com',
    location: {
      type: 'Point',
      coordinates: [79.0882, 21.1458], // Central Nagpur
    },
  },
  {
    title: 'House Cleaning',
    description: 'Professional cleaning services for homes and apartments.',
    price: mongoose.Types.Decimal128.fromString('650.00'),
    provider_name: 'CleanHome Nagpur',
    provider_contact: 9175552345,
    provider_email: 'info@cleanhomenagpur.com',
    location: {
      type: 'Point',
      coordinates: [79.0952, 21.1392], // Slightly southeast of center
    },
  },
  {
    title: 'Electrical Repair',
    description: 'Licensed electrician for all your electrical needs.',
    price: mongoose.Types.Decimal128.fromString('750.00'),
    provider_name: 'Nagpur Electric Solutions',
    provider_contact: 9175553456,
    provider_email: 'contact@nagpurelectric.com',
    location: {
      type: 'Point',
      coordinates: [79.0802, 21.1515], // Slightly northwest of center
    },
  },
  {
    title: 'AC Repair & Maintenance',
    description: 'Professional AC servicing, repair and installation.',
    price: mongoose.Types.Decimal128.fromString('1200.00'),
    provider_name: 'Cool Air Services',
    provider_contact: 9175554567,
    provider_email: 'service@coolairnagpur.com',
    location: {
      type: 'Point',
      coordinates: [79.1032, 21.1498], // East of center
    },
  },
  {
    title: 'Pest Control',
    description: 'Complete pest management solutions for homes and businesses.',
    price: mongoose.Types.Decimal128.fromString('950.00'),
    provider_name: 'Nagpur Pest Solutions',
    provider_contact: 9175555678,
    provider_email: 'info@nagpurpestsolutions.com',
    location: {
      type: 'Point',
      coordinates: [79.0752, 21.1378], // Southwest of center
    },
  },
  {
    title: 'Carpentry Work',
    description: 'Custom furniture making and woodwork repairs.',
    price: mongoose.Types.Decimal128.fromString('850.00'),
    provider_name: 'Woodcraft Nagpur',
    provider_contact: 9175556789,
    provider_email: 'orders@woodcraftnagpur.com',
    location: {
      type: 'Point',
      coordinates: [79.0732, 21.1518], // Northwest of center
    },
  },
  {
    title: 'Home Painting',
    description: 'Interior and exterior painting services with premium paints.',
    price: mongoose.Types.Decimal128.fromString('1500.00'),
    provider_name: 'ColorMyHome',
    provider_contact: 9175557890,
    provider_email: 'paint@colormyhome.com',
    location: {
      type: 'Point',
      coordinates: [79.1022, 21.1358], // Southeast of center
    },
  },
  {
    title: 'Laundry Services',
    description: 'Wash, dry and iron services with pick-up and delivery.',
    price: mongoose.Types.Decimal128.fromString('450.00'),
    provider_name: 'Fresh Laundry Nagpur',
    provider_contact: 9175558901,
    provider_email: 'care@freshlaundry.com',
    location: {
      type: 'Point',
      coordinates: [79.0932, 21.1538], // Northeast of center
    },
  },
  {
    title: 'Computer Repair',
    description: 'Professional computer and laptop repair services.',
    price: mongoose.Types.Decimal128.fromString('650.00'),
    provider_name: 'Tech Solutions Nagpur',
    provider_contact: 9175559012,
    provider_email: 'help@techsolutionsnagpur.com',
    location: {
      type: 'Point',
      coordinates: [79.0812, 21.1388], // Southwest of center
    },
  },
  {
    title: 'Gardening Services',
    description: 'Garden maintenance, landscaping and plant care.',
    price: mongoose.Types.Decimal128.fromString('750.00'),
    provider_name: 'Green Gardens',
    provider_contact: 9175550123,
    provider_email: 'info@greengardensnagpur.com',
    location: {
      type: 'Point',
      coordinates: [79.0992, 21.1428], // East of center
    },
  }
];

const addServices = async () => {
  try {
    await Service.insertMany(services);
    console.log(`${services.length} sample services for Nagpur added successfully!`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding services:', error);
    mongoose.connection.close();
  }
};

addServices();
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { FaUsers, FaTools, FaCheckCircle } from "react-icons/fa";
import "./Dashboard.css";

const services = [
  { name: "Plumbing", image: "https://cdn1.vectorstock.com/i/1000x1000/73/05/sanitary-engineering-plumber-at-plumbing-work-vector-10237305.jpg" },
  { name: "Electrician", image: "https://i.pinimg.com/736x/0f/db/ce/0fdbce72cbb55ba6c87495876d70f37e.jpg" },
  { name: "House Cleaning", image: "https://cdn5.vectorstock.com/i/1000x1000/44/69/man-male-cleaning-service-house-office-cleaner-vector-8294469.jpg" },
  { name: "Babysitting", image: "https://cdn.vectorstock.com/i/1000v/18/73/babysitter-cartoon-vector-44781873.jpg" },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container min-h-screen bg-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-16">
        <h1 className="text-5xl font-extrabold">Find Trusted Professionals Near You</h1>
        <p className="mt-4 text-lg">Book skilled service providers for your daily needs.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/services" className="btn-primary">Explore All Services</Link>
        </div>
      </section>

      {/* Search Bar */}
      <div className="search-container max-w-2xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
        <input type="text" placeholder="Search for services..." className="search-input" />
        <button className="search-btn">Search</button>
      </div>

      {/* Featured Services */}
      <section className="max-w-6xl mx-auto my-10">
        <h2 className="text-4xl font-bold text-center text-gray-800">Popular Services</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <Link to={`/service/${index + 1}`} key={index} className="service-card">
              <img src={service.image} alt={service.name} className="service-img" />
              <h3 className="service-name">{service.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works bg-gray-200 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <FaTools className="step-icon" />
            <h3>Find a Service</h3>
            <p>Browse through verified professionals for your needs.</p>
          </div>
          <div className="step">
            <FaUsers className="step-icon" />
            <h3>Book a Professional</h3>
            <p>Schedule an appointment at your convenience.</p>
          </div>
          <div className="step">
            <FaCheckCircle className="step-icon" />
            <h3>Get the Job Done</h3>
            <p>Enjoy hassle-free, top-quality services.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats bg-indigo-600 text-white py-12">
        <div className="stats-container">
          <div className="stat">
            <FaUsers className="stat-icon" />
            <h3>5,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat">
            <FaTools className="stat-icon" />
            <h3>300+</h3>
            <p>Verified Service Providers</p>
          </div>
          <div className="stat">
            <FaCheckCircle className="stat-icon" />
            <h3>10,000+</h3>
            <p>Completed Jobs</p>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />

      <Footer />
    </div>
  );
};

export default Dashboard;

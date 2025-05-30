import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { FaUsers, FaTools, FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Dashboard.css";

const services = [
  { name: "Cooking", image: "https://cdn-icons-gif.flaticon.com/10053/10053388.gif" },
  { name: "Plumbing", image: "https://cdn-icons-gif.flaticon.com/8629/8629461.gif" },
  { name: "Electrician", image: "https://cdn-icons-gif.flaticon.com/10607/10607595.gif" },
  { name: "House Cleaning", image: "https://cdn-icons-gif.flaticon.com/10053/10053408.gif" },
  { name: "Babysitting", image: "https://cdn-icons-gif.flaticon.com/15745/15745115.gif" },
  { name: "Repair", image: "https://cdn-icons-gif.flaticon.com/8629/8629195.gif" },
  { name: "Painting", image: "https://cdn-icons-gif.flaticon.com/8629/8629609.gif" },
  { name: "Gardening", image: "https://cdn-icons-gif.flaticon.com/8485/8485595.gif" },
  { name: "Carpentry", image: "https://cdn-icons-gif.flaticon.com/8629/8629619.gif" },
  { name: "Laundry", image: "https://cdn-icons-gif.flaticon.com/10053/10053384.gif" },
  { name: "Tutoring", image: "https://cdn-icons-gif.flaticon.com/18844/18844182.gif" },
  { name: "Photography", image: "https://cdn-icons-gif.flaticon.com/10053/10053386.gif" }
];

// Duplicate services to create seamless infinite scroll
const duplicatedServices = [...services, ...services, ...services];

const Dashboard = () => {
  const marqueeRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  // Handle manual scroll
  const handleScroll = () => {
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Resume auto-scroll after user stops scrolling for 2 seconds
    const timeout = setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
    
    setScrollTimeout(timeout);
  };

  // Manual scroll functions
  const scrollLeft = () => {
    if (marqueeRef.current) {
      marqueeRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      handleScroll();
    }
  };

  const scrollRight = () => {
    if (marqueeRef.current) {
      marqueeRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      handleScroll();
    }
  };

  // Handle infinite scroll reset
  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    if (!marqueeElement) return;

    const handleScrollReset = () => {
      const scrollLeft = marqueeElement.scrollLeft;
      const scrollWidth = marqueeElement.scrollWidth;
      const clientWidth = marqueeElement.clientWidth;
      
      // Reset position when reaching end or beginning
      if (scrollLeft >= scrollWidth - clientWidth - 100) {
        marqueeElement.scrollLeft = scrollWidth / 3;
      } else if (scrollLeft <= 100) {
        marqueeElement.scrollLeft = scrollWidth / 3;
      }
    };

    marqueeElement.addEventListener('scroll', handleScrollReset);
    return () => marqueeElement.removeEventListener('scroll', handleScrollReset);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

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
      <SearchBar />

      {/* Featured Services - Interactive Marquee */}
      <section className="max-w-full mx-auto px-4 my-16 overflow-hidden">
        <h2 className="section-title text-4xl font-bold text-center text-gray-800 mb-8">Popular Services</h2>
        
        <div className="marquee-wrapper">
          {/* Manual scroll buttons */}
          <button 
            className="scroll-button scroll-button-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
          
          <div 
            className={`marquee-container ${isUserScrolling ? 'user-scrolling' : ''}`}
            ref={marqueeRef}
            onScroll={handleScroll}
          >
            <div className="marquee-content">
              {duplicatedServices.map((service, index) => (
                <Link 
                  to={`/services/title/${service.name}`} 
                  key={`${service.name}-${index}`}
                  className="service-card-marquee"
                >
                  <div className="service-card-inner-marquee">
                    <img src={service.image} alt={service.name} className="service-img-marquee" />
                    <h3 className="service-name-marquee">{service.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <button 
            className="scroll-button scroll-button-right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
        
        {/* <div className="scroll-hint text-center mt-4 text-gray-500 text-sm">
          Use mouse wheel, touch, or arrow buttons to scroll • Auto-scroll pauses during interaction
        </div> */}
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

      <Footer />
    </div>
  );
};

export default Dashboard;

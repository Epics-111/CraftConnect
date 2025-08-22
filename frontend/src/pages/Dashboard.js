import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaShieldAlt, 
  FaBolt, 
  FaTrophy,
  FaSearch,
  FaCalendarCheck,
  FaThumbsUp,
  FaHeart,
  FaStar,
  FaMedal
} from "react-icons/fa";
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
      </section>

      {/* Why Choose CraftConnect Section */}
      <section className="why-choose-section bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose CraftConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <FaShieldAlt className="why-choose-icon" />
              </div>
              <h3 className="why-choose-title">Verified Professionals</h3>
              <p className="why-choose-desc">All service providers are background checked and verified for your safety</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <FaTrophy className="why-choose-icon" />
              </div>
              <h3 className="why-choose-title">Quality Guarantee</h3>
              <p className="why-choose-desc">100% satisfaction or your money back. We stand behind our work</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <FaBolt className="why-choose-icon" />
              </div>
              <h3 className="why-choose-title">Quick Booking</h3>
              <p className="why-choose-desc">Book instantly and get confirmed within hours. No waiting around</p>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon-wrapper">
                <FaHeart className="why-choose-icon" />
              </div>
              <h3 className="why-choose-title">Customer Love</h3>
              <p className="why-choose-desc">Highly rated by thousands of satisfied customers across the platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon-wrapper step-icon-blue">
                <FaSearch className="step-icon" />
              </div>
              <h3 className="step-title">Find a Service</h3>
              <p className="step-desc">Browse through verified professionals for your needs. Use our smart search to find exactly what you're looking for.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon-wrapper step-icon-green">
                <FaCalendarCheck className="step-icon" />
              </div>
              <h3 className="step-title">Book a Professional</h3>
              <p className="step-desc">Schedule an appointment at your convenience. Choose your preferred time slot and provide service details.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon-wrapper step-icon-purple">
                <FaThumbsUp className="step-icon" />
              </div>
              <h3 className="step-title">Get the Job Done</h3>
              <p className="step-desc">Enjoy hassle-free, top-quality services. Rate your experience and help others make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-yellow">
                <FaHeart className="stat-icon" />
              </div>
              <h3 className="stat-number">5,000+</h3>
              <p className="stat-label">Happy Customers</p>
              <p className="stat-subtitle">Satisfied with our services</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">
                <FaStar className="stat-icon" />
              </div>
              <h3 className="stat-number">300+</h3>
              <p className="stat-label">Verified Professionals</p>
              <p className="stat-subtitle">Skilled & background checked</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">
                <FaMedal className="stat-icon" />
              </div>
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Completed Jobs</p>
              <p className="stat-subtitle">Successfully delivered</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;

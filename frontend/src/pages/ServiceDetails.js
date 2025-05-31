import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";
import { apiRequest } from "../api";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaArrowLeft, 
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaShieldAlt
} from "react-icons/fa";
import "./ServiceDetails.css";

// Service category to GIF mapping
const serviceGifs = {
  "plumbing": "https://cdn-icons-gif.flaticon.com/8629/8629461.gif",
  "electrician": "https://cdn-icons-gif.flaticon.com/10607/10607595.gif",
  "house cleaning": "https://cdn-icons-gif.flaticon.com/10053/10053408.gif",
  "cleaning": "https://cdn-icons-gif.flaticon.com/10053/10053408.gif",
  "babysitting": "https://cdn-icons-gif.flaticon.com/15745/15745115.gif",
  "repair": "https://cdn-icons-gif.flaticon.com/8629/8629195.gif",
  "painting": "https://cdn-icons-gif.flaticon.com/8629/8629609.gif",
  "gardening": "https://cdn-icons-gif.flaticon.com/8485/8485595.gif",
  "carpentry": "https://cdn-icons-gif.flaticon.com/8629/8629619.gif",
  "laundry": "https://cdn-icons-gif.flaticon.com/10053/10053384.gif",
  "tutoring": "https://cdn-icons-gif.flaticon.com/18844/18844182.gif",
  "photography": "https://cdn-icons-gif.flaticon.com/10053/10053386.gif",
  "cooking": "https://cdn-icons-gif.flaticon.com/10053/10053388.gif",
  "default": "https://cdn-icons-gif.flaticon.com/8629/8629195.gif"
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState("Loading location...");
  
  // Generate time slots for next 7 days, every hour from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      
      const startHour = i === 0 ? now.getHours() + 1 : 9;
      
      for (let hour = startHour; hour <= 17; hour++) {
        if (i === 0 && hour < 9) continue;
        if (hour > 17) continue;
        
        date.setHours(hour, 0, 0, 0);
        slots.push(date.toISOString());
      }
    }
    
    return slots;
  };
  
  const [bookingState, setBookingState] = useState({
    showForm: false,
    selectedSlot: null,
    status: null,
    data: {
      client_name: "",
      client_email: "",
      booking_date: "",
      contact_number: "",
      special_instructions: ""
    }
  });

  // Get service GIF based on title/category
  const getServiceGif = (title) => {
    const serviceName = title.toLowerCase();
    for (const [key, gif] of Object.entries(serviceGifs)) {
      if (serviceName.includes(key)) {
        return gif;
      }
    }
    return serviceGifs.default;
  };

  // Generate fake but realistic ratings and reviews
  const generateServiceStats = (serviceId) => {
    const seed = serviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = 4 + (seed % 10) / 10;
    const reviews = 15 + (seed % 85);
    const completedJobs = 50 + (seed % 200);
    
    return {
      rating: Math.min(rating, 4.9),
      reviews,
      completedJobs
    };
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star-yellow" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-yellow" />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star-yellow" />);
    }
    
    return stars;
  };

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceData = await apiRequest(`/api/services/service/${id}`);
        serviceData.price = serviceData.price.$numberDecimal;
        setService(serviceData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setBookingState(prev => ({ ...prev, status: "Processing..." }));
      
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        throw new Error("User data not found. Please log in again.");
      }
      
      await apiRequest(`/api/bookings/create`, "POST", {
        service: id,
        client_name: userData.name,
        client_email: userData.email,
        booking_date: bookingState.data.booking_date,
        contact_number: bookingState.data.contact_number,
        special_instructions: bookingState.data.special_instructions
      });
      
      setBookingState(prev => ({ 
        ...prev, 
        status: "Booking successful! We'll contact you to confirm.", 
        showForm: false 
      }));
      
      setTimeout(() => {
        setBookingState(prev => ({ ...prev, status: null }));
      }, 5000);
    } catch (err) {
      console.error("Booking error:", err);
      setBookingState(prev => ({ 
        ...prev, 
        status: `Failed to create booking: ${err.message}`
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value
      }
    }));
  };

  // Using a free geocoding service like OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Available in your area";
    } catch (error) {
      return "Available in your area";
    }
  };

  useEffect(() => {
    if (service && service.location && service.location.coordinates) {
      const [lng, lat] = service.location.coordinates;
      reverseGeocode(lat, lng).then(setLocationName);
    }
  }, [service]);

  const formatLocation = (location) => {
    return locationName;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-content">
            <div className="animate-pulse">
              <div className="loading-hero">
                <div className="loading-gif"></div>
                <div className="loading-title"></div>
                <div className="loading-subtitle"></div>
              </div>
              
              <div className="loading-grid">
                <div className="loading-section">
                  <div className="loading-bar loading-bar-full"></div>
                  <div className="loading-bar loading-bar-large"></div>
                  <div className="loading-bar loading-bar-medium"></div>
                </div>
                <div className="loading-sidebar"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div className="error-content">
            <div className="error-gif">
              <img 
                src="https://cdn-icons-gif.flaticon.com/8629/8629195.gif" 
                alt="Error" 
                className="error-gif"
              />
            </div>
            <div className="error-card">
              <h2 className="error-title">Oops! Something went wrong</h2>
              <p className="error-message">Error: {error}</p>
              <p className="error-description">Unable to load service details. Please try again later.</p>
              <button 
                onClick={() => navigate(-1)}
                className="error-button"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const serviceStats = generateServiceStats(service._id);

  return (
    <>
      <Header />
      <div className="service-detail-container">
        {/* Hero Section */}
        <div className="service-hero">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
          
          <div className="hero-content">
            <button 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              <FaArrowLeft className="mr-2" /> Back to services
            </button>
            
            <div className="hero-title-section">
              <div className="mb-6">
                <img 
                  src={getServiceGif(service.title)} 
                  alt={service.title}
                  className="service-gif"
                />
              </div>
              <h1 className="hero-title">{service.title}</h1>
              <div className="rating-section">
                <div className="rating-stars">
                  {renderStars(serviceStats.rating)}
                  <span className="rating-score">{serviceStats.rating.toFixed(1)}</span>
                </div>
                <span className="rating-reviews">({serviceStats.reviews} reviews)</span>
              </div>
              <p className="hero-description">{service.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-grid">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card stat-card-green">
                  <FaCheckCircle className="stat-icon" />
                  <h3 className="stat-title">Completed Jobs</h3>
                  <p className="stat-value">{serviceStats.completedJobs}+</p>
                </div>
                
                <div className="stat-card stat-card-blue">
                  <FaUsers className="stat-icon" />
                  <h3 className="stat-title">Happy Customers</h3>
                  <p className="stat-value">{Math.floor(serviceStats.completedJobs * 0.95)}+</p>
                </div>
                
                <div className="stat-card stat-card-purple">
                  <FaShieldAlt className="stat-icon" />
                  <h3 className="stat-title">Verified</h3>
                  <p className="stat-subtitle">Professional</p>
                </div>
              </div>

              {/* Service Details Card */}
              <div className="info-card">
                <div className="card-header card-header-indigo">
                  <h2 className="card-title">
                    <FaClock className="mr-3" />
                    Service Details
                  </h2>
                </div>
                
                <div className="card-content">
                  <div className="details-grid">
                    <div className="space-y-4">
                      <div className="detail-item detail-item-blue">
                        <FaMapMarkerAlt className="detail-icon detail-icon-blue" />
                        <div>
                          <p className="detail-label">Service Area</p>
                          <p className="detail-value">{formatLocation(service.location)}</p>
                        </div>
                      </div>
                      
                      <div className="detail-item detail-item-green">
                        <div className="detail-icon detail-icon-green">₹</div>
                        <div>
                          <p className="detail-label">Starting Price</p>
                          <p className="price-value">₹{service.price}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="includes-section">
                        <h4 className="includes-title">What's Included:</h4>
                        <ul className="includes-list">
                          <li className="includes-item">✓ Professional service</li>
                          <li className="includes-item">✓ Quality materials</li>
                          <li className="includes-item">✓ Satisfaction guarantee</li>
                          <li className="includes-item">✓ Clean-up included</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Info Card */}
              <div className="info-card">
                <div className="card-header card-header-orange">
                  <h2 className="card-title">
                    <FaUsers className="mr-3" />
                    Your Service Provider
                  </h2>
                </div>
                
                <div className="card-content">
                  <div className="provider-info">
                    <div className="provider-avatar">
                      {service.provider_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="provider-name">{service.provider_name}</h3>
                      <p className="provider-title">Verified Professional</p>
                    </div>
                  </div>
                  
                  <div className="contact-grid">
                    <div className="contact-item contact-item-blue">
                      <FaPhone className="detail-icon detail-icon-blue" />
                      <div>
                        <p className="detail-label">Phone</p>
                        <p className="detail-value">{service.provider_contact}</p>
                      </div>
                    </div>
                    
                    <div className="contact-item contact-item-green">
                      <FaEnvelope className="detail-icon detail-icon-green" />
                      <div>
                        <p className="detail-label">Email</p>
                        <p className="detail-value">{service.provider_email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="booking-sidebar">
              <BookingForm 
                bookingState={bookingState}
                setBookingState={setBookingState}
                onSubmit={handleBookingSubmit}
                onChange={handleInputChange}
                timeSlots={generateTimeSlots()}
              />
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="trust-section">
          <div className="trust-container">
            <h2 className="trust-title">Why Choose CraftConnect?</h2>
            <div className="trust-grid">
              <div className="trust-item">
                <span className="trust-emoji">🛡️</span>
                <h3 className="trust-item-title">Verified Professionals</h3>
                <p className="trust-item-desc">All service providers are background checked</p>
              </div>
              <div className="trust-item">
                <span className="trust-emoji">💯</span>
                <h3 className="trust-item-title">Quality Guarantee</h3>
                <p className="trust-item-desc">100% satisfaction or your money back</p>
              </div>
              <div className="trust-item">
                <span className="trust-emoji">⚡</span>
                <h3 className="trust-item-title">Quick Booking</h3>
                <p className="trust-item-desc">Book instantly and get confirmed within hours</p>
              </div>
              <div className="trust-item">
                <span className="trust-emoji">🏆</span>
                <h3 className="trust-item-title">Top Rated</h3>
                <p className="trust-item-desc">Highly rated by thousands of customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceDetail;
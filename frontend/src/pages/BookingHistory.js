import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiRequest } from '../api';
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaTimes,
  FaEye,
  FaSpinner,
  FaCalendarAlt,
  FaHourglassHalf
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './BookingHistory.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [processingBooking, setProcessingBooking] = useState(null);

  const navigate = useNavigate();

  const STATUS_CONFIG = {
    pending: { icon: FaHourglassHalf, label: 'Pending', canCancel: true, color: 'pending' },
    confirmed: { icon: FaClock, label: 'Confirmed', canCancel: true, color: 'confirmed' },
    'in-progress': { icon: FaClock, label: 'In Progress', canCancel: false, color: 'progress' },
    completed: { icon: FaCheckCircle, label: 'Completed', canCancel: false, color: 'completed' },
    cancelled: { icon: FaTimesCircle, label: 'Cancelled', canCancel: false, color: 'cancelled' }
  };

  // Service icon mapping - same as ServiceCard component
  const getServiceIcon = (title) => {
    if (!title) return "https://cdn-icons-gif.flaticon.com/8629/8629195.gif";
    
    const titleLower = title.toLowerCase();
    if (titleLower.includes('plumb')) return "https://cdn-icons-gif.flaticon.com/8629/8629461.gif";
    if (titleLower.includes('electric')) return "https://cdn-icons-gif.flaticon.com/10607/10607595.gif";
    if (titleLower.includes('clean')) return "https://cdn-icons-gif.flaticon.com/10053/10053408.gif";
    if (titleLower.includes('paint')) return "https://cdn-icons-gif.flaticon.com/8629/8629609.gif";
    if (titleLower.includes('garden')) return "https://cdn-icons-gif.flaticon.com/8485/8485595.gif";
    if (titleLower.includes('carpen')) return "https://cdn-icons-gif.flaticon.com/8629/8629619.gif";
    if (titleLower.includes('cook') || titleLower.includes('chef')) return "https://cdn-icons-gif.flaticon.com/10053/10053388.gif";
    if (titleLower.includes('baby')) return "https://cdn-icons-gif.flaticon.com/15745/15745115.gif";
    if (titleLower.includes('repair')) return "https://cdn-icons-gif.flaticon.com/8629/8629195.gif";
    if (titleLower.includes('tutor') || titleLower.includes('teach')) return "https://cdn-icons-gif.flaticon.com/18844/18844182.gif";
    if (titleLower.includes('photo')) return "https://cdn-icons-gif.flaticon.com/10053/10053386.gif";
    if (titleLower.includes('laundry')) return "https://cdn-icons-gif.flaticon.com/10053/10053384.gif";
    if (titleLower.includes('home') || titleLower.includes('house')) return "https://cdn-icons-gif.flaticon.com/10053/10053408.gif";
    // Default icon for unmatched services
    return "https://cdn-icons-gif.flaticon.com/8629/8629195.gif";
  };

  const checkProfileCompletion = useCallback(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData?.name) {
      setIsProfileComplete(false);
      return false;
    }
    return true;
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.email) throw new Error('User email not found');

      const data = await apiRequest(`/api/bookings/consumer-history?client_email=${userData.email}`, 'GET');
      
      // Sort bookings by date - latest first
      const sortedBookings = data.sort((a, b) => {
        const dateA = new Date(a.booking_datetime || a.booking_date || a.createdAt);
        const dateB = new Date(b.booking_datetime || b.booking_date || b.createdAt);
        return dateB - dateA; // Latest first
      });
      
      setBookings(sortedBookings);
    } catch (err) {
      setError(err.message || 'Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkProfileCompletion()) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [checkProfileCompletion, fetchBookings]);

  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    const normalized = status.toLowerCase().trim();
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'in progress': 'in-progress',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'canceled': 'cancelled'
    };
    return statusMap[normalized] || 'pending';
  };

  const getStatusInfo = (status) => {
    const normalizedStatus = normalizeStatus(status);
    return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(0);
    }
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0' : numPrice.toFixed(0);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setProcessingBooking(bookingId);
      await apiRequest(`/api/bookings/update-status/${bookingId}`, 'PUT', { status: 'cancelled' });
      
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleViewService = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  if (!isProfileComplete) {
    return (
      <div className="booking-history-page">
        <Header />
        <div className="container">
          <div className="page-header">
            <h1>My Booking History</h1>
            <p>Track and manage all your service bookings</p>
          </div>
          <div className="profile-warning">
            <FaUser className="warning-icon" />
            <div>
              <p>Please complete your profile before accessing your booking history.</p>
              <Link to="/user-details" className="complete-profile-link">
                Complete your profile
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="booking-history-page">
        <Header />
        <div className="container">
          <div className="loading-state">
            <FaSpinner className="loading-spinner" />
            <span>Loading your bookings...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-history-page">
        <Header />
        <div className="container">
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={fetchBookings} className="btn btn-secondary">
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-history-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>My Booking History</h1>
          <p>Track and manage all your service bookings</p>
        </div>

        <div className="bookings-container">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <FaCalendarAlt className="empty-icon" />
              <h3>No Bookings Found</h3>
              <p>You haven't made any bookings yet.</p>
              <button onClick={() => navigate('/services')} className="btn btn-primary">
                Browse Services
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => {
                const statusInfo = getStatusInfo(booking.status);
                const StatusIcon = statusInfo.icon;
                const isProcessing = processingBooking === booking._id;
                const serviceTitle = booking.service?.title || booking.service?.name || 'Service Not Available';

                return (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <div className="service-info">
                        <div className="service-name-container">
                          <img 
                            src={getServiceIcon(serviceTitle)} 
                            alt={serviceTitle}
                            className="service-icon"
                          />
                          <h3 className="service-name">
                            {serviceTitle}
                          </h3>
                        </div>
                        <p className="booking-date">
                          <FaCalendarAlt /> {formatDate(booking.booking_datetime || booking.booking_date)}
                        </p>
                      </div>
                      <div className={`status-badge status-${statusInfo.color}`}>
                        <StatusIcon />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="booking-details">
                      <div className="detail-item">
                        <span className="label">Provider:</span>
                        <span className="value">
                          {booking.service?.provider_name || 'Not Available'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Price:</span>
                        <span className="value">₹{formatPrice(booking.service?.price)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Booking ID:</span>
                        <span className="value booking-id">{booking._id.slice(-8)}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button
                        onClick={() => handleViewService(booking.service?._id)}
                        className="btn btn-outline"
                        disabled={!booking.service?._id}
                      >
                        <FaEye /> View Service
                      </button>

                      {statusInfo.canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-danger"
                          disabled={isProcessing}
                        >
                          {isProcessing ? <FaSpinner className="spinner" /> : <FaTimes />}
                          {isProcessing ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
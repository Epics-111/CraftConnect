import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { apiRequest } from '../api';
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaTimes, FaSpinner, FaHourglassHalf } from 'react-icons/fa';

// Status configuration for consistent handling
const STATUS_CONFIG = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: FaHourglassHalf,
    label: 'Pending',
    canCancel: true
  },
  confirmed: {
    color: 'bg-blue-100 text-blue-800',
    icon: FaClock,
    label: 'Confirmed',
    canCancel: true
  },
  'in-progress': {
    color: 'bg-purple-100 text-purple-800',
    icon: FaClock,
    label: 'In Progress',
    canCancel: false // Changed to false since work has started
  },
  completed: {
    color: 'bg-green-100 text-green-800',
    icon: FaCheckCircle,
    label: 'Completed',
    canCancel: false
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: FaTimesCircle,
    label: 'Cancelled',
    canCancel: false
  }
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializePage();
  }, []);

  // New function to handle page initialization
  const initializePage = async () => {
    try {
      // First, trigger auto-completion of bookings
      await autoCompleteBookings();
      // Then fetch the updated booking history
      await fetchBookings();
    } catch (err) {
      console.error('Error initializing booking history page:', err);
      setError(err.message || 'Failed to load booking history');
      setLoading(false);
    }
  };

  // New function to call the auto-complete endpoint
  const autoCompleteBookings = async () => {
    try {
      // Call the Flask backend auto-complete endpoint
      const response = await apiRequest('/api/bookings/auto-complete', 'PUT');
      console.log('Auto-completion result:', response);
    } catch (error) {
      console.warn('Auto-completion request failed:', error);
      // Don't throw error here - we still want to show bookings even if auto-complete fails
    }
  };

  // Helper function to safely convert MongoDB Decimal128 or any price value to number
  const formatPrice = (price) => {
    if (!price) return '0';
    
    // Handle MongoDB Decimal128 format
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    
    // Handle regular number or string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0' : numPrice.toFixed(2);
  };

  const fetchBookings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.email) {
        throw new Error('User email not found');
      }

      const data = await apiRequest(`/api/bookings/consumer-history?client_email=${userData.email}`, 'GET');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    const normalized = status.toLowerCase().trim();
    
    // Handle various status formats
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'in progress': 'in-progress',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'canceled': 'cancelled' // Handle US spelling
    };
    
    return statusMap[normalized] || 'pending';
  };

  const getStatusInfo = (status) => {
    const normalizedStatus = normalizeStatus(status);
    return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pending;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingBooking(bookingId);
      
      await apiRequest(`/api/bookings/update-status/${bookingId}`, 'PUT', {
        status: 'cancelled'
      });

      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBooking(null);
    }
  };

  const handleMarkAsComplete = async (bookingId) => {
    if (!window.confirm('Mark this booking as completed?')) {
      return;
    }

    try {
      setCancellingBooking(bookingId); // Reuse loading state
      
      await apiRequest(`/api/bookings/update-status/${bookingId}`, 'PUT', {
        status: 'completed'
      });

      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'completed' }
            : booking
        )
      );

      console.log('Booking marked as completed successfully');
    } catch (err) {
      console.error('Error marking booking as complete:', err);
      alert('Failed to mark booking as complete. Please try again.');
    } finally {
      setCancellingBooking(null);
    }
  };

  const handleViewServiceDetails = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  const handleLeaveFeedback = (booking) => {
    // Placeholder for feedback functionality
    alert('Feedback feature coming soon!');
  };

  const renderBookingCard = (booking) => {
    const statusInfo = getStatusInfo(booking.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div 
        key={booking._id} 
        className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-[1.02] border border-gray-200"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {booking.service?.title || 'Service Unavailable'}
            </h2>
            
            <div className="space-y-1 text-gray-600 text-sm">
              <p className="flex items-center">
                <FaCalendar className="mr-2" />
                {formatDate(booking.booking_date)}
              </p>
              
              {booking.special_instructions && (
                <p>
                  <strong>Instructions:</strong> {booking.special_instructions}
                </p>
              )}
              
              {booking.contact_number && (
                <p>
                  <strong>Contact:</strong> {booking.contact_number}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <StatusIcon className="mr-1" />
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleViewServiceDetails(booking.service?._id)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={!booking.service?._id}
          >
            <FaEye className="mr-2" />
            View Service Details
          </button>

          {/* Mark as Complete Button */}
          {(normalizeStatus(booking.status) === 'confirmed' || normalizeStatus(booking.status) === 'in-progress') && (
            <button
              onClick={() => handleMarkAsComplete(booking._id)}
              disabled={cancellingBooking === booking._id}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancellingBooking === booking._id ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCheckCircle className="mr-2" />
              )}
              {cancellingBooking === booking._id ? 'Completing...' : 'Mark as Complete'}
            </button>
          )}

          {statusInfo.canCancel && (
            <button
              onClick={() => handleCancelBooking(booking._id)}
              disabled={cancellingBooking === booking._id}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancellingBooking === booking._id ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaTimes className="mr-2" />
              )}
              {cancellingBooking === booking._id ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}

          {normalizeStatus(booking.status) === 'completed' && (
            <button
              onClick={() => handleLeaveFeedback(booking)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaCheckCircle className="mr-2" />
              Leave Feedback
            </button>
          )}
        </div>

        {/* Booking Summary */}
        {booking.service?.price && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Service Price:</strong> ₹{formatPrice(booking.service.price)}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-md">
      <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">No bookings found</h2>
      <p className="mb-4">You haven't made any bookings yet.</p>
      <button 
        onClick={() => navigate('/services')}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Browse Services
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-red-500 text-center bg-red-50 p-6 rounded-lg">
      <p className="text-lg font-medium mb-2">Error</p>
      <p className="mb-4">{error}</p>
      <button 
        onClick={fetchBookings} 
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Booking History</h1>
        
        {loading ? (
          <SkeletonLoader type="bookingHistory" />
        ) : error ? (
          renderErrorState()
        ) : (
          <div className="grid gap-6">
            {bookings.length === 0 ? renderEmptyState() : bookings.map(renderBookingCard)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
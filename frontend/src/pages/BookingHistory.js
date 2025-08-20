import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
<<<<<<< HEAD
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
=======
import axios from 'axios';
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle, FaUser, FaTimes, FaChevronDown, FaChevronUp, FaPhone, FaCommentAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
>>>>>>> origin/main

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializePage();
=======
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const checkProfileCompletion = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.name) {
        setIsProfileComplete(false);
        return false;
      }
      return true;
    };

    const fetchBookings = async () => {
      try {
        // Check if profile is complete first
        if (!checkProfileCompletion()) {
          setLoading(false);
          return;
        }

        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/history`, 
          {
            params: { client_email: userData.email },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Process bookings to check for passed dates
        const processedBookings = response.data.map(booking => {
          const bookingDate = new Date(booking.booking_date);
          const now = new Date();
          
          // If status is still Pending but the date has passed, mark as "Expired"
          // This is just for display - we're not updating the database
          if (booking.status === 'Pending' && bookingDate < now) {
            return { ...booking, displayStatus: 'Expired' };
          }
          
          return { ...booking, displayStatus: booking.status };
        });
        
        setBookings(processedBookings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch booking history');
        setLoading(false);
      }
    };

    fetchBookings();
>>>>>>> origin/main
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
  
  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status === 200) {
        // Update the booking in the local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'Cancelled', displayStatus: 'Cancelled' } 
              : booking
          )
        );
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
        
<<<<<<< HEAD
        {loading ? (
          <SkeletonLoader type="bookingHistory" />
=======
        {!isProfileComplete ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUser className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please complete your profile before accessing your booking history.
                </p>
                <p className="mt-2">
                  <Link 
                    to="/user-details" 
                    className="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    Complete your profile
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center">Loading...</div>
>>>>>>> origin/main
        ) : error ? (
          renderErrorState()
        ) : (
          <div className="grid gap-6">
<<<<<<< HEAD
            {bookings.length === 0 ? renderEmptyState() : bookings.map(renderBookingCard)}
=======
            {bookings.length === 0 ? (
              <div className="text-center text-gray-500">No bookings found</div>
            ) : (
              bookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-[1.01]"
                >
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleExpand(booking._id)}
                  >
                    <div>
                      <h2 className="text-xl font-semibold">{booking.service.title}</h2>
                      <p className="text-gray-600 mt-2">
                        <FaCalendar className="inline mr-2" />
                        {formatDate(booking.booking_date)}
                      </p>
                      <p className="text-gray-600 mt-1">
                        <FaClock className="inline mr-2" />
                        Status: {booking.displayStatus}
                      </p>
                      <div className="mt-3 text-sm text-blue-600 flex items-center">
                        {expandedId === booking._id ? (
                          <>Hide details <FaChevronUp className="ml-1" /></>
                        ) : (
                          <>View details <FaChevronDown className="ml-1" /></>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${booking.displayStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                          booking.displayStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.displayStatus === 'Expired' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'}`}>
                        {booking.displayStatus === 'Completed' ? <FaCheckCircle className="mr-1" /> : 
                         booking.displayStatus === 'Cancelled' ? <FaTimesCircle className="mr-1" /> : 
                         booking.displayStatus === 'Expired' ? <FaTimesCircle className="mr-1" /> :
                         <FaClock className="mr-1" />}
                        {booking.displayStatus}
                      </span>
                      
                      {booking.displayStatus === 'Pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking._id);
                          }}
                          disabled={cancellingId === booking._id}
                          className={`mt-2 flex items-center justify-center px-3 py-1 text-sm font-medium rounded 
                            ${cancellingId === booking._id ? 
                              'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                              'bg-red-50 text-red-600 hover:bg-red-100'}`}
                        >
                          {cancellingId === booking._id ? (
                            'Cancelling...'
                          ) : (
                            <>
                              <FaTimes className="mr-1" />
                              Cancel
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded details section */}
                  {expandedId === booking._id && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Service Details</h3>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Price:</span> ${booking.service.price?.$numberDecimal || booking.service.price || 'N/A'}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Description:</span> {booking.service.description}
                          </p>
                          <div className="mt-2">
                            <Link 
                              to={`/service/${booking.service._id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              View Service Page
                            </Link>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
                          <p className="text-gray-700 mb-1 flex items-center">
                            <FaUser className="mr-2 text-gray-500" />
                            <span className="font-medium">Client:</span> {booking.client_name}
                          </p>
                          <p className="text-gray-700 mb-1 flex items-center">
                            <FaPhone className="mr-2 text-gray-500" />
                            <span className="font-medium">Contact:</span> {booking.contact_number}
                          </p>
                          {booking.special_instructions && (
                            <p className="text-gray-700 mt-2">
                              <FaCommentAlt className="inline mr-2 text-gray-500" />
                              <span className="font-medium">Instructions:</span> {booking.special_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
>>>>>>> origin/main
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
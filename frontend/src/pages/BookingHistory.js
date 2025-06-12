import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { apiRequest } from '../api';
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaTimes, FaSpinner } from 'react-icons/fa';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.email) {
          throw new Error('User email not found');
        }

        // Use apiRequest instead of axios
        const data = await apiRequest(`/api/bookings/consumer-history?client_email=${userData.email}`, 'GET');
        
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch booking history');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingBooking(bookingId);
      
      // Call the backend endpoint to update booking status to cancelled
      await apiRequest(`/api/bookings/update-status/${bookingId}`, 'PUT', {
        status: 'cancelled'
      });

      // Update the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'Cancelled' }
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

  const handleViewServiceDetails = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  const canCancelBooking = (booking) => {
    // Can only cancel if status is 'Pending' or 'Confirmed'
    return booking.status === 'Pending' || booking.status === 'confirmed';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="mr-1" />;
      case 'cancelled':
        return <FaTimesCircle className="mr-1" />;
      default:
        return <FaClock className="mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Booking History</h1>
        
        {loading ? (
          <SkeletonLoader type="bookingHistory" />
        ) : error ? (
          <div className="text-red-500 text-center bg-red-50 p-6 rounded-lg">
            <p className="text-lg font-medium mb-2">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.length === 0 ? (
              <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-md">
                <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">No bookings found</h2>
                <p>You haven't made any bookings yet.</p>
                <button 
                  onClick={() => navigate('/services')}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-[1.02] border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {booking.service.title}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        <FaCalendar className="inline mr-2" />
                        {formatDate(booking.booking_date)}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <FaClock className="inline mr-2" />
                        Status: {booking.status}
                      </p>
                      {booking.special_instructions && (
                        <p className="text-gray-600 text-sm">
                          <strong>Instructions:</strong> {booking.special_instructions}
                        </p>
                      )}
                      {booking.contact_number && (
                        <p className="text-gray-600 text-sm">
                          <strong>Contact:</strong> {booking.contact_number}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewServiceDetails(booking.service._id)}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaEye className="mr-2" />
                      View Service Details
                    </button>

                    {canCancelBooking(booking) && (
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

                    {booking.status.toLowerCase() === 'completed' && (
                      <button
                        onClick={() => {
                          // You can implement feedback functionality here
                          alert('Feedback feature coming soon!');
                        }}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaCheckCircle className="mr-2" />
                        Leave Feedback
                      </button>
                    )}
                  </div>

                  {/* Booking Summary */}
                  {booking.service.price && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600">
                        <strong>Service Price:</strong> 
                        <span className="text-green-600 font-medium ml-2">
                          ₹{booking.service.price.$numberDecimal || booking.service.price}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle, FaUser, FaTimes, FaChevronDown, FaChevronUp, FaPhone, FaCommentAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Booking History</h1>
        
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
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid gap-6">
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
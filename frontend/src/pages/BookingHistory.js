import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiRequest } from '../api';
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.email) {
          throw new Error('User email not found');
        }

        // Use apiRequest instead of axios
        const data = await apiRequest(`/api/bookings/history?client_email=${userData.email}`, 'GET');
        
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Booking History</h1>
        
        {loading ? (
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
                  className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{booking.service.title}</h2>
                      <p className="text-gray-600 mt-2">
                        <FaCalendar className="inline mr-2" />
                        {formatDate(booking.booking_date)}
                      </p>
                      <p className="text-gray-600 mt-1">
                        <FaClock className="inline mr-2" />
                        Status: {booking.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {booking.status === 'Completed' ? <FaCheckCircle className="mr-1" /> : 
                         booking.status === 'Cancelled' ? <FaTimesCircle className="mr-1" /> : 
                         <FaClock className="mr-1" />}
                        {booking.status}
                      </span>
                    </div>
                  </div>
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
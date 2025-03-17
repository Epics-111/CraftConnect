import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaCommentAlt, FaPhone, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookingForm = ({ bookingState, setBookingState, onSubmit, onChange, timeSlots }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  
  // Load user data from localStorage when component mounts
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        // Check if profile is complete
        if (!user.name || !user.name.trim()) {
          setIsProfileComplete(false);
        } else {
          setIsProfileComplete(true);
          setBookingState(prev => ({
            ...prev,
            data: {
              ...prev.data,
              client_name: user.name || '',
              client_email: user.email || '',
            }
          }));
        }
      } else {
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      setIsProfileComplete(false);
    }
  }, [setBookingState]);

  // Group time slots by date
  const groupedTimeSlots = timeSlots.reduce((groups, slot) => {
    const date = new Date(slot).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  // Available dates (with time slots)
  const availableDates = Object.keys(groupedTimeSlots);

  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  // Check if a date is available (has time slots)
  const isDateAvailable = (dateString) => {
    return availableDates.includes(dateString);
  };

  // Render calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    
    let days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isAvailable = isDateAvailable(dateString);
      const isToday = new Date().toISOString().split('T')[0] === dateString;
      const isSelected = selectedDate === dateString;
      
      days.push(
        <div 
          key={day}
          onClick={() => {
            if (isAvailable) {
              setSelectedDate(dateString);
            }
          }}
          className={`flex items-center justify-center h-10 rounded-full cursor-pointer 
            ${isAvailable ? 'hover:bg-blue-100' : 'text-gray-300 cursor-not-allowed'}
            ${isToday ? 'border border-blue-500' : ''}
            ${isSelected ? 'bg-blue-500 text-white' : ''}
          `}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="calendar">
        <div className="flex justify-between items-center mb-4">
          <button 
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
          <div className="font-medium">
            {monthName} {year}
          </div>
          <button 
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          <div className="font-medium text-gray-500">Su</div>
          <div className="font-medium text-gray-500">Mo</div>
          <div className="font-medium text-gray-500">Tu</div>
          <div className="font-medium text-gray-500">We</div>
          <div className="font-medium text-gray-500">Th</div>
          <div className="font-medium text-gray-500">Fr</div>
          <div className="font-medium text-gray-500">Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };
  
  // Render time slots for the selected date
  const renderTimeSlots = () => {
    if (!selectedDate || !groupedTimeSlots[selectedDate]) {
      return (
        <p className="text-gray-500 italic">Please select a date to view available time slots</p>
      );
    }
    
    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">
          Available times for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {groupedTimeSlots[selectedDate].map(slot => {
            const timeOnly = new Date(slot).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setBookingState(prev => ({
                  ...prev,
                  selectedSlot: slot,
                  data: { ...prev.data, booking_date: slot }
                }))}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  bookingState.selectedSlot === slot 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FaClock className="inline-block mr-1" /> {timeOnly}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <button
        onClick={() => {
          if (isProfileComplete) {
            setBookingState(prev => ({ ...prev, showForm: !prev.showForm }));
          }
        }}
        className={`w-full md:w-auto px-6 py-3 font-semibold rounded-lg transition-colors ${
          isProfileComplete 
            ? "bg-blue-500 text-white hover:bg-blue-600" 
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {bookingState.showForm ? "Cancel Booking" : "Book Now"}
      </button>

      {!isProfileComplete && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 mb-2">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUser className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please complete your profile before making a booking.
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
      )}

      {bookingState.status && (
        <div className={`mt-4 p-4 rounded-lg ${
          bookingState.status.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {bookingState.status}
        </div>
      )}

      {isProfileComplete && bookingState.showForm && (
        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center mb-3">
                <FaCalendarAlt className="mr-2 text-blue-500" /> Select Date & Time
              </h3>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                {renderCalendar()}
                <div className="mt-6 border-t pt-4">
                  {renderTimeSlots()}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center mb-3">
                <FaPhone className="mr-2 text-blue-500" /> Contact Number
              </h3>
              <input
                type="tel"
                name="contact_number"
                value={bookingState.data.contact_number || ''}
                onChange={onChange}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">We'll use this number to confirm your booking or notify you of any changes</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 flex items-center mb-3">
                <FaCommentAlt className="mr-2 text-blue-500" /> Special Instructions
              </h3>
              <textarea
                name="special_instructions"
                value={bookingState.data.special_instructions || ''}
                onChange={onChange}
                placeholder="Any specific requirements or details the service provider should know"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            {!bookingState.selectedSlot && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-700 font-medium">Please select a date and time slot to continue</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!bookingState.selectedSlot}
            className={`w-full py-3 font-semibold rounded-lg transition-colors ${
              bookingState.selectedSlot 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            Confirm Booking
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
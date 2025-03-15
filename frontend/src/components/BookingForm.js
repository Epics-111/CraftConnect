import React from 'react';

const BookingForm = ({ bookingState, setBookingState, onSubmit, onChange, timeSlots }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <button
        onClick={() => setBookingState(prev => ({ ...prev, showForm: !prev.showForm }))}
        className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        {bookingState.showForm ? "Cancel Booking" : "Book Now"}
      </button>

      {bookingState.status && (
        <div className={`mt-4 p-4 rounded-lg ${
          bookingState.status.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {bookingState.status}
        </div>
      )}

      {bookingState.showForm && (
        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="client_name"
                value={bookingState.data.client_name}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="client_email"
                value={bookingState.data.client_email}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setBookingState(prev => ({
                      ...prev,
                      selectedSlot: slot,
                      data: { ...prev.data, booking_date: slot }
                    }))}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      bookingState.selectedSlot === slot 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea
                name="message"
                value={bookingState.data.message}
                onChange={onChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="md:col-span-2 w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Confirm Booking
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
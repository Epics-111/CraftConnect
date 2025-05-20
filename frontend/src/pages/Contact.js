import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { apiRequest } from "../api"; // Import the apiRequest utility

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // Add error state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous errors
    
    try {
      // Send form data to the backend using apiRequest
      await apiRequest('/api/contact', 'POST', formData);
      
      console.log("Form submitted successfully");
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "Failed to submit contact form. Please try again later.");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="contact-hero bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">We'd love to hear from you! Get in touch with our team.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FaEnvelope className="mx-auto text-4xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-700">support@craftconnect.com</p>
              <p className="text-gray-700">info@craftconnect.com</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FaPhone className="mx-auto text-4xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-700">+1 (555) 123-4567</p>
              <p className="text-gray-700">Mon-Fri: 9AM - 5PM</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FaMapMarkerAlt className="mx-auto text-4xl text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Office</h3>
              <p className="text-gray-700">123 Service Street</p>
              <p className="text-gray-700">San Francisco, CA 94105</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Send us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8 text-center">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : null}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label htmlFor="name" className="block mb-2 text-gray-700 font-medium">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group mb-6">
                <label htmlFor="subject" className="block mb-2 text-gray-700 font-medium">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="form-group mb-8">
                <label htmlFor="message" className="block mb-2 text-gray-700 font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
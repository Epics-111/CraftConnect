import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ServiceDetails from "./pages/ServiceDetails";
import ProtectedRoute from './components/ProtectedRoute';
import UserDetails from "./pages/UserDetails";
import Reviews from "./pages/Reviews";
import ServiceListByTitle from "./pages/ServiceListByTitle";
import SearchResults from "./pages/SearchResults";
import ChatbotWidget from "./components/ChatbotWidget";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import BookingHistory from "./pages/BookingHistory";

// Create a component to conditionally render the ChatbotWidget
const ConditionalChatbot = () => {
  const location = useLocation();
  const [showChatbot, setShowChatbot] = useState(false);
  
  useEffect(() => {
    // Only show chatbot if user is logged in (token exists) and not on login page
    const isLoggedIn = localStorage.getItem("token") !== null;
    const isLoginPage = location.pathname === "/";
    setShowChatbot(isLoggedIn && !isLoginPage);
  }, [location]);
  
  return showChatbot ? <ChatbotWidget /> : null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginSignup />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/user-details" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/service/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
        <Route path="/services/title/:title" element={<ProtectedRoute><ServiceListByTitle /></ProtectedRoute>} />
        <Route path="/search/:query" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
        
        {/* Routes for footer pages - accessible to all authenticated users */}
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
        
        {/* Catch all for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConditionalChatbot />
    </Router>
  );
}

export default App;
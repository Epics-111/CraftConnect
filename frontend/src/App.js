import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ServiceDetails from "./pages/ServiceDetails";
import ProtectedRoute from './components/ProtectedRoute';
import UserDetails from "./pages/UserDetails";
// import Reviews from "./pages/Reviews";
import ServiceListByTitle from "./pages/ServiceListByTitle";
import SearchResults from "./pages/SearchResults";
import ChatbotWidget from "./components/ChatbotWidget"; //have a look here
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import BookingHistory from "./pages/BookingHistory";
import NearbyServicesPage from './pages/NearbyServicesPage';

// Layout component that includes the chatbot for all protected routes
const ProtectedLayout = ({ children }) => (
  <>
    {children}
    <ChatbotWidget />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - no chatbot */}
        <Route path="/" element={<LoginSignup />} />
        
        {/* Protected routes - all include chatbot */}
        <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/user-details" element={<ProtectedRoute><ProtectedLayout><UserDetails /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><ProtectedLayout><Services /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/service/:id" element={<ProtectedRoute><ProtectedLayout><ServiceDetails /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/services/title/:title" element={<ProtectedRoute><ProtectedLayout><ServiceListByTitle /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/search/:query" element={<ProtectedRoute><ProtectedLayout><SearchResults /></ProtectedLayout></ProtectedRoute>} />
        {/* <Route path="/reviews" element={<ProtectedRoute><ProtectedLayout><Reviews /></ProtectedLayout></ProtectedRoute>} /> */}
        <Route path="/booking-history" element={<ProtectedRoute><ProtectedLayout><BookingHistory /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/nearby-services" element={<ProtectedRoute><ProtectedLayout><NearbyServicesPage /></ProtectedLayout></ProtectedRoute>} />
        
        {/* Routes for footer pages - with chatbot */}
        <Route path="/about" element={<ProtectedRoute><ProtectedLayout><About /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute><ProtectedLayout><Privacy /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute><ProtectedLayout><Terms /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ProtectedLayout><Contact /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/faqs" element={<ProtectedRoute><ProtectedLayout><FAQs /></ProtectedLayout></ProtectedRoute>} />
        
        {/* Catch all for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
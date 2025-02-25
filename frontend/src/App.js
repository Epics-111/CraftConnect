import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ServiceDetails from "./pages/ServiceDetails";
import ProtectedRoute from './components/ProtectedRoute';
import UserDetails from "./pages/UserDetails";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/user-details" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/service/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
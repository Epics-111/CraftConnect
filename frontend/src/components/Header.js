// src/components/Header.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../auth";
import "./Header.css";
import { FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(navigate);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/dashboard">
          <img src="/icon.jpg" alt="CraftConnect Logo" className="logo-icon" />
          CraftConnect
        </Link>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/user-details" onClick={() => setMenuOpen(false)}>
              <FaUser className="nav-icon" /> Profile
            </Link>
          </li>
          <li>
            <Link to="/booking-history" onClick={() => setMenuOpen(false)}>
              <FaHistory className="nav-icon" /> Booking History
            </Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="nav-icon" /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

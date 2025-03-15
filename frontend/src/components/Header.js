// src/components/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth";
import "./Header.css";

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
        <a href="/dashboard">
          <img src="/icon.jpg" alt="CraftConnect Logo" className="logo-icon" />
          CraftConnect
        </a>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/user-details" onClick={() => setMenuOpen(false)}>Profile</a></li>
          <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

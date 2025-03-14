// src/components/Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <header className="header">
      <div className="logo">
        <a href="/dashboard">
          <img src="/icon.jpg" alt="CraftConnect Logo" className="logo-icon" />
          CraftConnect
        </a>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="/user-details">Profile</a></li>
          <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

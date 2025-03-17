import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About CraftConnect</h3>
          <p>
            CraftConnect connects skilled professionals with customers needing home services. 
            Our platform makes finding and booking trusted service providers easy and reliable.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>VIT Bhopal University
Bhopal-Indore Highway,
Kothrikalan, Sehore,
Madhya Pradesh - 466114,
India.</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>9999999999</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>support@craftconnect.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} CraftConnect. All rights reserved.</span>
        <span>Made with <span className="heart-icon"><FaHeart /></span> by CraftConnect Team</span>
      </div>
    </footer>
  );
};

export default Footer;
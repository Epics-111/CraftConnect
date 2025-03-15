import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaTools, FaBriefcase, FaDollarSign } from "react-icons/fa";
import "./UserDetails.css";

const UserDetails = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("consumer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPassword(user.password || "");
          setAge(user.age || "");
          setContactNo(user.contact_no || "");
          setRole(user.role || "consumer");
          
          if (user.role === "provider" && user.providerDetails) {
            setServiceType(user.providerDetails.serviceType || "");
            setExperience(user.providerDetails.experience || "");
            setHourlyRate(user.providerDetails.hourlyRate || "");
          } else if (user.role === "consumer" && user.consumerDetails) {
            setAddress(user.consumerDetails.address || "");
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        return /\S+@\S+\.\S+/.test(value) ? '' : 'Please enter a valid email';
      case 'age':
        return value && !isNaN(value) && value > 0 ? '' : 'Please enter a valid age';
      case 'contactNo':
        return value && /^\d{10}$/.test(value.toString()) ? '' : 'Please enter a valid 10-digit number';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    
    // Add more validation rules as needed
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update the field value
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      // Handle other fields similarly
    }
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSaveDetails = async () => {
    if (!validateForm()) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }
    
    setSaveStatus("saving");
    
    const userDetails = {
      name,
      email,
      password,
      age,
      contact_no: contactNo,
      role,
      providerDetails: role === "provider" ? { serviceType, experience, hourlyRate } : undefined,
      consumerDetails: role === "consumer" ? { address } : undefined,
    };

    try {
      // Save the response to a variable and use it
      const response = await apiRequest("/api/user-details/save-details", "POST", userDetails);
      
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...currentUser,
        ...userDetails,
        providerDetails: role === "provider" ? userDetails.providerDetails : currentUser.providerDetails,
        consumerDetails: role === "consumer" ? userDetails.consumerDetails : currentUser.consumerDetails
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSaveStatus("success");
      
      // Display the success message from the API if available
      if (response?.message) {
        console.log("API success:", response.message);
      }
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving details:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <h1>Your Profile</h1>
          <p>Manage your personal information and service preferences</p>
        </div>
        
        <div className="profile-tabs">
          <div className={`tab ${role === "consumer" ? "active" : ""}`} onClick={() => setRole("consumer")}>
            Consumer Profile
          </div>
          <div className={`tab ${role === "provider" ? "active" : ""}`} onClick={() => setRole("provider")}>
            Service Provider Profile
          </div>
        </div>
        
        <div className="profile-form-container">
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="input-icon" /> Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`${errors.name ? 'error' : ''}`}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" /> Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" /> Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Update your password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">
                <FaBirthdayCake className="input-icon" /> Age
              </label>
              <input
                id="age"
                type="number"
                name="age"
                value={age}
                onChange={handleInputChange}
                placeholder="Enter your age"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNo">
                <FaPhone className="input-icon" /> Contact Number
              </label>
              <input
                id="contactNo"
                type="text"
                name="contactNo"
                value={contactNo}
                onChange={handleInputChange}
                placeholder="Enter your contact number"
              />
            </div>
          </div>
          
          {role === "consumer" && (
            <div className="form-section">
              <h2>Consumer Details</h2>
              
              <div className="form-group">
                <label htmlFor="address">
                  <FaMapMarkerAlt className="input-icon" /> Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  rows="3"
                ></textarea>
              </div>
            </div>
          )}
          
          {role === "provider" && (
            <div className="form-section">
              <h2>Service Provider Details</h2>
              
              <div className="form-group">
                <label htmlFor="serviceType">
                  <FaTools className="input-icon" /> Service Type
                </label>
                <input
                  id="serviceType"
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="E.g., Plumbing, Electrical, Cleaning"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">
                  <FaBriefcase className="input-icon" /> Experience (years)
                </label>
                <input
                  id="experience"
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Years of experience"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="hourlyRate">
                  <FaDollarSign className="input-icon" /> Hourly Rate
                </label>
                <input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Your hourly rate"
                />
              </div>
            </div>
          )}
          
          <div className="save-section">
            <button 
              className={`save-button ${saveStatus ? saveStatus : ""}`} 
              onClick={handleSaveDetails}
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "Saving..." : 
               saveStatus === "success" ? "Saved Successfully!" : 
               saveStatus === "error" ? "Error Saving" : 
               "Save Profile"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDetails;

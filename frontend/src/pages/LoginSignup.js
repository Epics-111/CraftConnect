// src/pages/LoginSignup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        
        // Create a basic user object if data.user is undefined
        const userData = data.user || { 
          email: email,
          role: "consumer" // Default role
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Stored user data:", userData);
        
        setSuccess(isLogin ? "Login successful! Redirecting..." : "Account created! Redirecting...");
        
        // Short delay before redirect for better UX
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(data.message || data.error || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Connection error. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="background-illustration"></div>
      <div className="form-container">
        <h1>
          <img src="/icon.jpg" alt="CraftConnect Logo" className="login-icon" />
          CraftConnect
        </h1>
        
        {/* Show error message if there is one */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Show success message if there is one */}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={error && error.includes("email") ? "invalid-shake" : ""}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={error && error.includes("password") ? "invalid-shake" : ""}
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className={loading ? "loading-button" : ""}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span className="loading-text">Processing</span>
              </>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </button>
        </form>
        
        <p onClick={() => !loading && setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
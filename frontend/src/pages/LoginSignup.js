// src/pages/LoginSignup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api"; 
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
      
      // Use your API utility function for consistent error handling
      const data = await apiRequest(endpoint, "POST", { email, password });
      
      // For login success
      if (isLogin) {
        // Verify required tokens exist
        if (!data.access_token || !data.refresh_token) {
          throw new Error("Authentication response missing required tokens");
        }
        
        // Store tokens in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        
        // Store the complete user object
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("User data stored successfully:", data.user);
        } else {
          // Fallback for backward compatibility
          localStorage.setItem("user", JSON.stringify({ 
            email: email,
            role: "consumer" 
          }));
        }
      }
      
      // Set appropriate success message
      setSuccess(isLogin ? "Login successful! Redirecting..." : "Account created! Redirecting...");
      
      // Redirect after successful login/signup
      setTimeout(() => {
        if (isLogin) {
          navigate("/dashboard");
        } else {
          // After signup, switch to login view
          setIsLogin(true);
          setSuccess("Account created! Please log in.");
          setEmail("");
          setPassword("");
        }
      }, 1500);
      
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
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
            minLength={6}
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
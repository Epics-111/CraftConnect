import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (user) {
        console.log("User data from localStorage:", user); // Debugging
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
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleSaveDetails = async () => {
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
      const data = await apiRequest("/api/user-details/save-details", "POST", userDetails);
      alert(data.message);
      
      // Update the local storage with new data
      const updatedUser = {...JSON.parse(localStorage.getItem("user")), ...userDetails};
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      alert("Error saving details: " + error.message);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
          Loading user data...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#fff", boxShadow: "0 5px 10px rgba(0, 0, 0, 0.15)", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Profile</h2>
        <form>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Role</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="consumer"
                  checked={role === "consumer"}
                  onChange={() => setRole("consumer")}
                />
                Consumer
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  value="provider"
                  checked={role === "provider"}
                  onChange={() => setRole("provider")}
                />
                Service Provider
              </label>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Contact Number</label>
            <input
              type="text"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
            />
          </div>
          {role === "consumer" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
              />
            </div>
          )}
          {role === "provider" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Service Type</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Experience (years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "5px" }}>Hourly Rate</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }}
                />
              </div>
            </>
          )}
          <button 
            type="button" 
            onClick={handleSaveDetails} 
            style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px", fontSize: "18px", cursor: "pointer" }}>
            Save Details
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UserDetails;

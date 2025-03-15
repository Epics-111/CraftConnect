const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { encrypt } = require("../utils/encryption");
const User = require("../models/User");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    // deterministic hash of the email for lookup
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");
    let user = await User.findOne({ emailHash });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // userid will be email till @ symbol
    const userId = email.substring(0, email.indexOf("@"));
    const encryptedEmail = encrypt(email);
    user = new User({ userId, email: encryptedEmail, emailHash, password });

    await user.save();

    const token = generateToken(user);
    res.status(201).json({ message: "User registered successfully", token });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");
    const user = await User.findOne({ emailHash });
    
    if (user && user.password === password) {
      const token = generateToken(user._id);
      
      // Create a user object without sensitive information
      const userData = {
        _id: user._id,
        email: email, // Use original email since it's hashed in DB
        name: user.name || '',
        role: user.role || 'consumer',
        age: user.age || '',
        contact_no: user.contact_no || '',
        providerDetails: user.providerDetails || {},
        consumerDetails: user.consumerDetails || {}
      };
      
      res.status(200).json({
        message: "Login successful",
        token,
        user: userData
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
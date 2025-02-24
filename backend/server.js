require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const userRoutes = require("./routes/userRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const careerGuidanceRoutes = require("./routes/careerGuidanceRoutes");
const userDetailsRoutes = require('./routes/userDetailsRoutes');


const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.REACT_FRONTEND_URL);


// Rate Limiter Configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});


// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/api/", apiLimiter); 

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/career-guidance", careerGuidanceRoutes);
app.use("/api/user-details", userDetailsRoutes); // Ensure this line is present

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
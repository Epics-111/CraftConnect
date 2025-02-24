const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { saveUserDetails } = require('../controllers/userDetailsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", authMiddleware, getUserProfile);
router.put('/user-details', authMiddleware, saveUserDetails);

module.exports = router;
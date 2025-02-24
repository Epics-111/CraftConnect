const express = require("express");
const { saveUserDetails } = require("../controllers/userDetailsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/save-details", authMiddleware, saveUserDetails);

module.exports = router;
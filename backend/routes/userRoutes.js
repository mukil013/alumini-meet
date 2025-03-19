const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  validateUser,
  updateProfile,
} = require("../controller/userController");

// Route to send OTP
router.post("/sendOTP", sendOTP);

// Route to verify OTP and register user
router.post("/verifyOTP", verifyOTP);

// Route to validate user login
router.post("/validateUser", validateUser);

// Route to update user profile
router.post("/updateProfile/:id", updateProfile);

module.exports = router;
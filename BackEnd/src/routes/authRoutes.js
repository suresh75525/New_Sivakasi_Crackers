const express = require("express");
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  login,
} = require("../controllers/authController");
const authorize = require("../Authorize/authorize"); // Import the middleware

router.post("/otp/request", requestOtp);
router.post("/otp/verify", verifyOtp);
router.post("/login", login);

// Example protected route
router.get("/profile", authorize, (req, res) => {
  res.json({ message: "Authorized access!", user: req.user });
});

module.exports = router;

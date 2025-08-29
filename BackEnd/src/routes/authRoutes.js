const express = require("express");
const router = express.Router();
const { requestOtp, verifyOtp } = require("../controllers/authController");

router.post("/otp/request", requestOtp);
router.post("/otp/verify", verifyOtp);

module.exports = router;

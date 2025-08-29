const OtpLogin = require("../models/OtpLogin");
const User = require("../models/User");
const { Op } = require("sequelize");
const { sendWhatsApp } = require("../utils/twilioHelper.js");

exports.requestOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Check if mobile already exists in otp_logins
    const existingOtp = await OtpLogin.findOne({
      where: { mobile_number: mobile },
      order: [["created_at", "DESC"]],
    });

    if (existingOtp) {
      // Update the existing OTP
      existingOtp.otp_code = otp;
      existingOtp.is_verified = false; // reset verification
      existingOtp.sent_via = "whatsapp";
      existingOtp.created_at = new Date();
      await existingOtp.save();
    } else {
      // Insert a new record
      await OtpLogin.create({
        mobile_number: mobile,
        otp_code: otp,
        sent_via: "whatsapp",
      });
    }

    // Send OTP via WhatsApp
    await sendWhatsApp(
      mobile,
      `🔐 Your Sivakasi Crackers Admin OTP is: *${otp}*`
    );

    console.log(`📩 OTP for admin ${mobile}: ${otp}`);

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error in requestOtp:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Get latest OTP for this mobile
    const latestOtp = await OtpLogin.findOne({
      where: { mobile_number: mobile },
      order: [["created_at", "DESC"]],
    });

    if (!latestOtp) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    // ✅ If OTP already used
    if (latestOtp.is_verified) {
      return res.status(400).json({ message: "OTP already used" });
    }

    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    const expiryTime = new Date(
      latestOtp.created_at.getTime() + otpExpiryMinutes * 60000
    );

    // 🚨 If OTP expired → generate new
    if (new Date() > expiryTime) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      await OtpLogin.create({
        mobile_number: mobile,
        otp_code: newOtp,
        sent_via: "whatsapp",
      });

      await sendWhatsApp(
        mobile,
        `⚠️ Your previous OTP expired. New OTP is: *${newOtp}*`
      );

      return res
        .status(400)
        .json({ message: "OTP expired. A new OTP has been sent." });
    }

    // ✅ If OTP mismatch
    if (latestOtp.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Success → mark as verified
    latestOtp.is_verified = true;
    await latestOtp.save();

    return res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("❌ Error in verifyOtp:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

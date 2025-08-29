const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendWhatsApp = async (to, message) => {
  try {
    const res = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
      body: message,
    });
    console.log("✅ WhatsApp sent:", res.sid);
    return res;
  } catch (err) {
    console.error("❌ Error sending WhatsApp:", err.message);
    throw err;
  }
};

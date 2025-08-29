// utils/whatsappHelper.js
const fs = require("fs");

async function sendWhatsAppMessageWithPDF(to, message, pdfPath) {
  if (!fs.existsSync(pdfPath)) throw new Error("PDF not found");

  // 🔥 In real integration -> Call WhatsApp Cloud API
  console.log("📩 WhatsApp Message Sent:");
  console.log("To:", to);
  console.log("Message:", message);
  console.log("PDF Attached:", pdfPath);

  return true;
}

module.exports = { sendWhatsAppMessageWithPDF };

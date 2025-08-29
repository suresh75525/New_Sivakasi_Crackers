const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Address = require("../models/Address");

async function generateInvoice(orderId) {
  const order = await Order.findOne({
    where: { order_id: orderId },
    include: [{ model: OrderItem }, { model: Address }],
  });

  if (!order) throw new Error("Order not found");

  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

  const filePath = path.join(invoiceDir, `invoice_${orderId}.pdf`);
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(18).text("Sivakasi Crackers - Invoice", { align: "center" });
  doc.moveDown();

  // Order & Customer Info
  doc.fontSize(12).text(`Invoice ID: INV-${orderId}`);
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`);
  doc.moveDown();

  const addr = order.Addresses[0] || {};
  doc.text(`Customer: ${addr.name || ""}`);
  doc.text(`Mobile: ${addr.mobile_number || ""}`);
  doc.text(`Address: ${addr.address_line1 || ""}, ${addr.address_line2 || ""}`);
  doc.text(`${addr.city || ""} - ${addr.pincode || ""}`);
  if (addr.landmark) doc.text(`Landmark: ${addr.landmark}`);
  doc.moveDown();

  // Table header
  doc.fontSize(12).text("Products:", { underline: true });
  doc.moveDown();

  doc.fontSize(10);
  doc.text("Product", 50, doc.y, { continued: true });
  doc.text("Qty", 200, doc.y, { continued: true });
  doc.text("Price", 250, doc.y, { continued: true });
  doc.text("Discount", 320, doc.y, { continued: true });
  doc.text("GST", 400, doc.y, { continued: true });
  doc.text("Total", 470);
  doc.moveDown();

  let subTotal = 0;

  order.OrderItems.forEach((item) => {
    const qty = item.quantity;
    const price = parseFloat(item.price_per_unit);
    const discount = parseFloat(item.discount_amount) || 0;
    const gstAmt = parseFloat(item.gst_amount) || 0;
    const lineTotal = qty * price - discount + gstAmt;

    subTotal += qty * price;

    doc.text(item.product_name, 50, doc.y, { continued: true });
    doc.text(qty, 200, doc.y, { continued: true });
    doc.text(price.toFixed(2), 250, doc.y, { continued: true });
    doc.text(discount.toFixed(2), 320, doc.y, { continued: true });
    doc.text(gstAmt.toFixed(2), 400, doc.y, { continued: true });
    doc.text(lineTotal.toFixed(2), 470);
  });

  doc.moveDown();

  // Summary
  doc.fontSize(12);
  doc.text(`Subtotal: ₹${subTotal.toFixed(2)}`, { align: "right" });
  doc.text(`Discount: -₹${parseFloat(order.discount_amount || 0).toFixed(2)}`, {
    align: "right",
  });
  doc.text(`GST: ₹${parseFloat(order.gst_amount || 0).toFixed(2)}`, {
    align: "right",
  });
  doc.text(`Grand Total: ₹${parseFloat(order.total_amount).toFixed(2)}`, {
    align: "right",
  });

  doc.end();

  return `/invoices/invoice_${orderId}.pdf`; // relative path for API
}

module.exports = generateInvoice;

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Address = require('../models/Address');
const Invoice = require('../models/Invoice');

exports.generateInvoice = async (req, res) => {
  try {
    const { order_id } = req.params;

    // 1️⃣ Fetch order details
    const order = await Order.findByPk(order_id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: Address }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 2️⃣ Create PDF file path
    const invoiceDir = path.join(__dirname, '../../invoices');
    if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

    const filePath = path.join(invoiceDir, `invoice_${order_id}.pdf`);

    // 3️⃣ Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text('Sivakasi Crackers Invoice', { align: 'center' });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Invoice No: ${order_id}`);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`);
    doc.text(`Status: ${order.order_status}`);
    doc.moveDown();

    // Address
    const addr = order.Address || {};
    doc.text(`Bill To: ${addr.name || ''}`);
    doc.text(`Mobile: ${addr.mobile_number || ''}`);
    doc.text(`${addr.address_line1 || ''}`);
    doc.text(`${addr.address_line2 || ''}`);
    doc.text(`${addr.city || ''} - ${addr.pincode || ''}`);
    doc.text(`Landmark: ${addr.landmark || ''}`);
    doc.moveDown();

    // Table Header
    doc.fontSize(12).text('Products:', { underline: true });
    doc.moveDown();

    let totalGST = 0;
    order.OrderItems.forEach(item => {
      const gstAmount = (item.price_per_unit * item.quantity * item.gst_percentage) / 100;
      totalGST += gstAmount;
      doc.text(`${item.Product.name} x ${item.quantity} @ ₹${item.price_per_unit} (GST ${item.gst_percentage}%)`);
    });

    doc.moveDown();
    doc.text(`Total Amount: ₹${order.total_amount}`);
    doc.text(`Total GST: ₹${totalGST.toFixed(2)}`);
    doc.moveDown();

    doc.text('Thank you for shopping with us!', { align: 'center' });

    doc.end();

    // Wait for PDF to finish
    writeStream.on('finish', async () => {
      // Update invoice record in DB
      const pdfUrl = `/invoices/invoice_${order_id}.pdf`;

      await Invoice.update(
        { pdf_url: pdfUrl },
        { where: { order_id } }
      );

      return res.json({
        message: 'Invoice generated successfully',
        pdf_url: pdfUrl
      });
    });

  } catch (error) {
    console.error('❌ Error generating invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

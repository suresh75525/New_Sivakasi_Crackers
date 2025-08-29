const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

exports.confirmPayment = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // 1️⃣ Find payment record
    const payment = await Payment.findOne({ where: { order_id } });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // 2️⃣ Update payment info
    payment.payment_method = payment_method || payment.payment_method;
    payment.payment_status = 'Completed';
    payment.paid_at = new Date();
    await payment.save();

    // 3️⃣ Update order info
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.payment_received = 1;
    order.order_status = 'Paid';
    await order.save();

    // 4️⃣ Create invoice record
    const invoice = await Invoice.create({
      order_id,
      pdf_url: null // Will be set after PDF generation
    });

    // TODO: Optionally trigger WhatsApp/SMS/email notification to admin

    return res.json({
      message: 'Payment confirmed and invoice generated',
      payment,
      invoice
    });

  } catch (error) {
    console.error('❌ Error in confirmPayment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

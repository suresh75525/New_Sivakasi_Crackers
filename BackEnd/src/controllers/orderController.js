// controllers/orderController.js
const path = require("path");
const sequelize = require("../config/db");
const GuestCart = require("../models/GuestCart");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Address = require("../models/Address");
const Invoice = require("../models/Invoice");
const { sendWhatsAppMessage } = require("../utils/whatsappHelper");

const { generateInvoice } = require("../utils/invoiceGenerator");
const { devLog } = require("../utils/logger");

exports.placeOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      session_id,
      name,
      mobile_number,
      address_line1,
      address_line2,
      city,
      pincode,
      landmark,
    } = req.body;

    if (!session_id || !mobile_number || !/^\d{10}$/.test(mobile_number)) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "session_id and valid mobile_number required" });
    }

    const cartItems = await GuestCart.findAll({
      where: { session_id },
      include: [{ model: Product }],
      transaction: t,
    });

    if (!cartItems.length) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let user = await User.findOne({ where: { mobile_number }, transaction: t });
    if (!user) {
      user = await User.create({ name, mobile_number }, { transaction: t });
    }

    let totalAmount = 0,
      totalGst = 0;
    cartItems.forEach((item) => {
      const price = parseFloat(item.Product.price_per_unit);
      const gstPct = parseFloat(item.Product.gst_percentage) || 0;
      const qty = item.quantity;
      const gstAmt = (price * qty * gstPct) / 100;
      totalGst += gstAmt;
      totalAmount += price * qty + gstAmt;
    });

    const order = await Order.create(
      {
        user_id: user.user_id,
        total_amount: totalAmount.toFixed(2),
        gst_amount: totalGst.toFixed(2),
        order_status: "Pending",
        payment_received: 0,
        idempotency_key: null,
      },
      { transaction: t }
    );

    for (const item of cartItems) {
      const price = parseFloat(item.Product.price_per_unit);
      const gstPct = parseFloat(item.Product.gst_percentage) || 0;
      const qty = item.quantity;
      const discount = price * qty * 0.73;

      const gstAmt = (price * qty * gstPct) / 100;

      await OrderItem.create(
        {
          order_id: order.order_id,
          product_id: item.product_id,
          product_name: item.Product.name,
          quantity: qty,
          price_per_unit: price,
          discount_amount: price - discount,
          gst_percentage: gstPct,
          gst_amount: gstAmt,
        },
        { transaction: t }
      );
    }

    await Address.create(
      {
        order_id: order.order_id,
        name,
        mobile_number,
        address_line1,
        address_line2,
        city,
        pincode,
        landmark,
      },
      { transaction: t }
    );

    const deletedCount = await GuestCart.destroy({
      where: { session_id },
      transaction: t,
    });
    console.log(
      `Deleted guest cart records: ${deletedCount} for session_id: ${session_id}`
    );

    // ✅ COMMIT FIRST
    await t.commit();

    // ── Post-commit side effects (don’t rollback order if they fail) ──
    try {
      const pdfPath = await generateInvoice(order.order_id); // no tx
      await Invoice.create({
        order_id: order.order_id,
        pdf_url: `/ invoices / ${path.basename(pdfPath)}`,
      }); // no tx

      await sendWhatsAppMessage(
        process.env.TWILIO_WHATSAPP_TO,
        [
          "Congratulations! You have a new order.",
          "----------------------------------",
          "Customer Details",
          `Name: ${name}    Mob No: ${mobile_number}`,
          `Address: ${address_line1}    City: ${city}`,
          `Pincode: ${pincode}    Landmark: ${landmark}`,
          "----------------------------------",
          "S.No   Product Name   Quantity   Price",
          cartItems
            .map(
              (item, idx) =>
                `${idx + 1}. ${item.Product.name}   ${item.quantity}   ₹${
                  item.Product.price_per_unit
                }`
            )
            .join("\n"),
        ].join("\n")
      );
    } catch (sideEffectErr) {
      console.error(
        "⚠️ Post-commit step failed (invoice/WhatsApp):",
        sideEffectErr
      );
      // optional: update a flag on order or log to a table for retry
    }
    // here
    return res.json({
      message: "Order placed successfully",
      order_id: order.order_id,
    });
  } catch (error) {
    try {
      await t.rollback();
    } catch {}
    console.error("❌ placeOrder error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderDtls = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: ["order_id"],
      include: [
        {
          model: OrderItem,
          attributes: [
            "product_name",
            "quantity",
            "price_per_unit",
            "discount_amount",
          ],
        },
        {
          model: Address,
          attributes: [
            "address_line1",
            "address_line2",
            "city",
            "pincode",
            "landmark",
          ],
        },
        {
          model: Invoice,
          attributes: ["pdf_url"],
        },
      ],
    });

    res.json({ orders });
  } catch (error) {
    console.error("❌ Error in getOrderDtls:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// src/models/Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // ✅ export is the instance

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    gst_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    order_status: {
      type: DataTypes.ENUM(
        "Pending",
        "Paid",
        "Packing",
        "Shipped",
        "Delivered"
      ),
      defaultValue: "Pending",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    payment_received: { type: DataTypes.BOOLEAN, defaultValue: false }, // maps to TINYINT(1)
    idempotency_key: { type: DataTypes.STRING(100), allowNull: true }, // not unique since you removed usage
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

module.exports = Order;

// src/models/OrderItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: true },
    product_name: { type: DataTypes.STRING(255), allowNull: false }, // snapshot
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    gst_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    gst_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

module.exports = OrderItem;

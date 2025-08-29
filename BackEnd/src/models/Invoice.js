const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');

const Invoice = sequelize.define('Invoice', {
  invoice_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: true },
  pdf_url: { type: DataTypes.STRING(1000), allowNull: true },
  generated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'invoices',
  timestamps: false
});

Invoice.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Invoice;

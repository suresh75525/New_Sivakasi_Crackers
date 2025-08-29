const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');

const Payment = sequelize.define('Payment', {
  payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: true },
  payment_method: { 
    type: DataTypes.ENUM('qr', 'online', 'cod'), 
    defaultValue: 'qr' 
  },
  payment_status: { 
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), 
    defaultValue: 'Pending' 
  },
  paid_at: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'payments',
  timestamps: false
});

Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Payment;

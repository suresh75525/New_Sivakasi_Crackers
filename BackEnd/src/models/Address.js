const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');

const Address = sequelize.define('Address', {
  address_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING(100), allowNull: true },
  mobile_number: { type: DataTypes.STRING(15), allowNull: true },
  address_line1: { type: DataTypes.STRING(255), allowNull: true },
  address_line2: { type: DataTypes.STRING(255), allowNull: true },
  city: { type: DataTypes.STRING(100), allowNull: true },
  pincode: { type: DataTypes.STRING(10), allowNull: true },
  landmark: { type: DataTypes.STRING(100), allowNull: true }
}, {
  tableName: 'addresses',
  timestamps: false
});

Address.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Address;

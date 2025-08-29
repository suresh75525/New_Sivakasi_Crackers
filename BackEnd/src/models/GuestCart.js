const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const User = require('./User');

const GuestCart = sequelize.define('GuestCart', {
  guest_cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  session_id: { type: DataTypes.STRING(255), allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10,2) }, // total after discount + GST
  gst_amount: { type: DataTypes.DECIMAL(10,2) }, // ✅ added for faster retrieval
  added_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  user_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'guest_carts',
  timestamps: false
});

// Associations
GuestCart.belongsTo(Product, { foreignKey: 'product_id' });
GuestCart.belongsTo(User, { foreignKey: 'user_id' });

module.exports = GuestCart;

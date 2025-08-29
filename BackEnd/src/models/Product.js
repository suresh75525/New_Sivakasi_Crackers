const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  price_per_unit: { type: DataTypes.DECIMAL(10, 2) },
  image_url: { type: DataTypes.STRING(1000) },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  gst_percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 }
}, {
  tableName: 'products',
  timestamps: false
});

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;

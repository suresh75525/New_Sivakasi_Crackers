const Order = require("./Order");
const OrderItem = require("./OrderItem");
const User = require("./User");
const Product = require("./Product");
const Address = require("./Address");
const Invoice = require("./Invoice");

Order.belongsTo(User, { foreignKey: "user_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" });
Order.hasOne(Address, { foreignKey: "order_id" });
Order.hasOne(Invoice, { foreignKey: "order_id" });

OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

Address.belongsTo(Order, { foreignKey: "order_id" });
Invoice.belongsTo(Order, { foreignKey: "order_id" });

module.exports = { Order, OrderItem, User, Product, Address, Invoice };

// src/models/associations.js
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const User = require("./User");
const Product = require("./Product");

Order.belongsTo(User, { foreignKey: "user_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" }); // no alias → default getter is order.OrderItems

OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

module.exports = { Order, OrderItem, User, Product };

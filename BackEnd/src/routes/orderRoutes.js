const express = require("express");
const router = express.Router();
const { placeOrder } = require("../controllers/orderController");

// Place order
router.post("/placeOrder", placeOrder);

module.exports = router;

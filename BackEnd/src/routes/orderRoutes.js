const express = require("express");
const router = express.Router();
const { placeOrder, getOrderDtls } = require("../controllers/orderController");

// Place order
router.post("/placeOrder", placeOrder);

router.get("/getOrderDtls", getOrderDtls);

module.exports = router;

const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controllers/invoiceController');

router.get('/generate/:order_id', generateInvoice);

module.exports = router;

const express = require('express');
const router = express.Router();
const { confirmPayment } = require('../controllers/paymentController');

router.post('/confirm', confirmPayment);

module.exports = router;

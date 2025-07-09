const express = require('express');
const router = express.Router();
const { createInstamojoPaymentRequest, verifyInstamojoPayment } = require('../controllers/paymentController');

router.post('/create-order', createInstamojoPaymentRequest);
router.post('/verify', verifyInstamojoPayment);

module.exports = router;
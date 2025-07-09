const axios = require('axios');
const Order = require('../models/Order'); // Import Order model
require('dotenv').config();

const INSTAMOJO_API_URL = 'https://www.instamojo.com/api/1.1/payment-requests/';

// POST /api/payments/create-order - Create an Instamojo payment request
exports.createInstamojoPaymentRequest = async (req, res, next) => {
  try {
    // Pass the frontend request body as-is
    const requestBody = req.body;

    // Basic validation
    if (!requestBody.amount || !requestBody.purpose) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Amount and purpose are required'
        }
      });
    }

    // Make request to Instamojo API
    const response = await axios.post(INSTAMOJO_API_URL, requestBody, {
      headers: {
        'X-Api-Key': process.env.API_KEY,
        'X-Auth-Token': process.env.AUTH_TOKEN
      }
    });

    // Pass Instamojo response directly to frontend
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    // Handle Instamojo API errors
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: {
          code: 'INSTAMOJO_ERROR',
          message: error.response.data.message || 'Failed to create payment request',
          details: error.response.data
        }
      });
    }
    next(error);
  }
};

// POST /api/payments/verify - Verify payment status and update order
exports.verifyInstamojoPayment = async (req, res, next) => {
  try {
    const { payment_request_id, payment_id, orderId } = req.body;

    // Basic validation
    if (!payment_request_id || !payment_id || !orderId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Payment request ID, payment ID, and order ID are required'
        }
      });
    }

    // Check payment status with Instamojo API
    const response = await axios.get(`${INSTAMOJO_API_URL}${payment_request_id}/`, {
      headers: {
        'X-Api-Key': process.env.API_KEY,
        'X-Auth-Token': process.env.AUTH_TOKEN
      }
    });

    const paymentStatus = response.data.payment_request.payments.find(
      payment => payment.payment_id === payment_id
    );

    if (!paymentStatus) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Payment not found'
        }
      });
    }

    // Update order if payment status is "Credit"
    if (paymentStatus.status === 'Credit') {
      const order = await Order.findOneAndUpdate(
        { orderNumber: orderId },
        { advancePaid: true },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Order not found'
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        payment_request_id,
        payment_id,
        status: paymentStatus.status,
        message: `Payment verification completed: ${paymentStatus.status}`
      }
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: {
          code: 'INSTAMOJO_ERROR',
          message: error.response.data.message || 'Failed to verify payment',
          details: error.response.data
        }
      });
    }
    next(error);
  }
};

module.exports = {
  createInstamojoPaymentRequest: exports.createInstamojoPaymentRequest,
  verifyInstamojoPayment: exports.verifyInstamojoPayment
};
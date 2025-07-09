const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrderByNumber, 
//   create Ascending order
  createOrder, 
  updateOrderStatus 
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getOrders);
router.get('/:orderNumber', getOrderByNumber);
router.post('/', createOrder);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.get('/dashboard', authMiddleware, getDashboardStats);

module.exports = router;
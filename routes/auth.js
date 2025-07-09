const express = require('express');
const router = express.Router();
const { adminLogin, adminLogout } = require('../controllers/authController');

router.post('/admin/login', adminLogin);
router.post('/admin/logout', adminLogout);

module.exports = router;
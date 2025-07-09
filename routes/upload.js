const express = require('express');
const router = express.Router();
const { uploadImagesMiddleware, handleImageUpload } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/auth');

router.post('/images', authMiddleware, uploadImagesMiddleware, handleImageUpload);

module.exports = router;
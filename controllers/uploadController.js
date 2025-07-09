const multer = require('multer');
const path = require('path');
require('dotenv').config(); // Ensure dotenv is loaded

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Middleware for handling multiple image uploads
exports.uploadImagesMiddleware = upload.array('images', 5);

// Handler for processing uploaded images
exports.handleImageUpload = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILES_UPLOADED',
          message: 'No files were uploaded'
        }
      });
    }

    // Use BASE_URL from environment variable
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const urls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

    res.status(201).json({
      success: true,
      data: { urls }
    });
  } catch (error) {
    next(error);
  }
};
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dipperDropUpload', // Folder in Cloudinary to store images
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Middleware for handling multiple image uploads
exports.uploadImagesMiddleware = upload.array('images', 5);

// Handler for processing uploaded images
exports.handleImageUpload = async (req, res, next) => {
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

    // Extract Cloudinary URLs from uploaded files
    const urls = req.files.map(file => file.path); // Cloudinary provides the full URL in file.path

    res.status(201).json({
      success: true,
      data: { urls }
    });
  } catch (error) {
    next(error);
  }
};
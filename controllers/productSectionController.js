const ProductSection = require('../models/ProductSection');
const Product = require('../models/Product'); // Added to validate productId
const { validationResult } = require('express-validator');

// GET /api/products/:productId/sections - Get product detail sections
exports.getProductSections = async (req, res, next) => {
  try {
    const sections = await ProductSection.find({ productId: req.params.productId })
      .sort('order');
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};

// POST /api/product-sections - Create a new product12 product section
exports.createProductSection = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const { productId, title, description, image, features, order } = req.body;

    // Validate productId exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    const section = new ProductSection({
      productId,
      title,
      description,
      image,
      features: features || [],
      order
    });

    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// PUT /api/product-sections/:id - Update product section
exports.updateProductSection = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const { title, description, image, features, order } = req.body;

    const section = await ProductSection.findByIdAndUpdate(
      req.params.id,
      { title, description, image, features, order },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product section not found'
        }
      });
    }

    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/product-sections/:id - Delete product section
exports.deleteProductSection = async (req, res, next) => {
  try {
    const section = await ProductSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Product section not found'
        }
      });
    }

    res.status(200).json({ success: true, message: 'Product section deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductSections: exports.getProductSections,
  createProductSection: exports.createProductSection,
  updateProductSection: exports.updateProductSection,
  deleteProductSection: exports.deleteProductSection
};
const express = require('express');
const router = express.Router();
const { 
  getProductSections, 
  createProductSection, 
  updateProductSection, 
  deleteProductSection 
} = require('../controllers/productSectionController');
const authMiddleware = require('../middleware/auth');

router.get('/:productId/sections', getProductSections);
router.post('/', authMiddleware, createProductSection);
router.put('/:id', authMiddleware, updateProductSection);
router.delete('/:id', authMiddleware, deleteProductSection);

module.exports = router;
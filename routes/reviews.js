const express = require('express');
const router = express.Router();
const { 
  getProductReviews, 
  createReview 
} = require('../controllers/reviewController');

router.get('/:productId/reviews', getProductReviews);
router.post('/', createReview);

module.exports = router;
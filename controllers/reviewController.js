const Review = require('../models/Review');
const { validationResult } = require('express-validator');

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, error: errors.array() });
    }

    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};
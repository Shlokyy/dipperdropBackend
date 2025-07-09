const mongoose = require('mongoose');

const productSectionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  features: [{ type: String }],
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductSection', productSectionSchema);
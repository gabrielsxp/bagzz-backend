const mongoose = require('mongoose');

const ShoppingChartSchema = mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    amount: { type: Number, default: 0 }
  }],
  totalPrice: {
    type: Number,
    default: 0
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

ShoppingChartSchema.virtual('products_', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id'
});

ShoppingChartSchema.virtual('user_', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id'
});

module.exports = mongoose.model('ShoppingChart', ShoppingChartSchema);
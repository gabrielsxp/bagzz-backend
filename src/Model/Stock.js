const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  amount: {
    type: Number,
    default: 0
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductColor',
    default: null
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductSize',
    default: null
  },
}, { timestamps: true });

StockSchema.virtual('product_', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id'
});
StockSchema.virtual('productSize_', {
  ref: 'ProductSize',
  localField: 'productSize_',
  foreignField: '_id'
});
StockSchema.virtual('productColor_', {
  ref: 'ProductColor',
  localField: 'productColor_',
  foreignField: '_id'
});

module.exports = mongoose.model('Stock', StockSchema);
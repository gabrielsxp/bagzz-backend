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
  }
}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);
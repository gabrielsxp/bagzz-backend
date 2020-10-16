const mongoose = require('mongoose');

const DiscountSchema = mongoose.Schema({
  value: {
    type: Number,
    default: 0
  },
  keyword: {
    type: String,
    default: '',
    require: false
  },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null }],
  banner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Banner', default: null }],
  global: { type: Boolean, default: false },
  startDate: Date,
  endDate: Date,
  reedemable: {
    type: Boolean,
    default: false
  },
  minValue: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Discount', DiscountSchema);
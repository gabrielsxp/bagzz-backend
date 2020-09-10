const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
  name: String,
  description: String,
  text: String,
  image: String,
  startDate: Date,
  endDate: Date,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  }],
  textEnabled: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

BannerSchema.virtual('products_', {
  ref: 'Product',
  localField: 'products',
  foreignField: '_id'
});

module.exports = mongoose.model('Banner', BannerSchema);
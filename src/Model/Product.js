const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: String,
  description: String,
  uri: {
    type: String,
    required: true,
    unique: true
  },
  style: String,
  price: String,
  weight: Number,
  x: Number,
  y: Number,
  z: Number,
  mainImage: String,
  active: {
    type: Number,
    default: 1
  },
  images: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
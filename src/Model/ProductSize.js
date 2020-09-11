const mongoose = require('mongoose');

const ProductSizeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  uri: {
    type: String,
    required: true,
    unique: true
  },
  valueFlutuation: {
    type: Number,
    default: 0
  },
  chest: {
    type: Number,
    required: true
  },
  waist: {
    type: Number,
    required: true
  },
  hips: {
    type: Number,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('ProductSize', ProductSizeSchema);
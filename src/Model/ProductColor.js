const mongoose = require('mongoose');

const ProductColorSchema = mongoose.Schema({
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
  hex: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ProductColor', ProductColorSchema);
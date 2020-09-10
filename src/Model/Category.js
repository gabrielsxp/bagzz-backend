const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: String,
  image: String,
  active: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
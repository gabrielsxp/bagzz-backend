const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: String,
  uri: {
    type: String,
    required: true,
    unique: true
  },
  image: String,
  active: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
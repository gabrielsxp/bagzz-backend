const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
  name: String,
  type: String,
  street: String,
  district: String,
  number: String,
  postalCode: String,
  city: String,
  state: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);
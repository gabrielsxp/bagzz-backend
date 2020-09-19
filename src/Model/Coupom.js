const mongoose = require('mongoose');

const CoupomSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Bundle', BundleSchema);
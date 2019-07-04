const mongoose = require('mongoose');

const BundleSchema = mongoose.Schema({
    name: String,
    price: Number,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Post'
        }
    ],
    active: {type: Boolean, default: false},
    owner: {type: mongoose.Schema.Types.ObjectId, red: 'User'},
    discount: {type: Number, defaut: 0}
});

module.exports = mongoose.model('Bundle', BundleSchema);
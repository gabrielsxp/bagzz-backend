const mongoose = require('mongoose');
const User = require('../Model/User');

const ShoppingChartSchema = mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('ShoppingChart', TransactionSchema);
const mongoose = require('mongoose');
const User = require('../Model/User');

const TransactionSchema = mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    customerUsername: String,
    customerEmail: String,
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    sellerUsername: String,
    sellerEmail: String,
    amount: Number,
    useBalance: {type: Boolean, default: false},
    productBuyed: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'
    }],
    productNames: [{
        type: String
    }]
},{ timestamps: true });

TransactionSchema.pre('save', async function(next){
    const user = await User.findOne({username: this.sellerUsername});
    user.balance += this.amount;
    user.revenue += this.amount;
    if(this.useBalance){
        const customer = await findById(this.customer);
        customer.balance -= this.amount;
        await customer.save();
    }
    await user.save();

    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
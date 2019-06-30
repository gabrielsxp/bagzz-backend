const Transaction = require('../Model/Transaction');

module.exports = {
    store(customer, customerUsername, customerEmail, seller, sellerUsername, sellerEmail, amount, productBuyed, productNames) {
        return new Promise((resolve, reject) => {
            Transaction.create({
                customer,
                customerUsername,
                customerEmail,
                seller,
                sellerUsername,
                sellerEmail,
                amount,
                productBuyed,
                productNames
            })
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    async index(req, res) {
        console.log(req.query);
        try {
            let transactions = [];
            let t = [];

            if (req.query.seller === 'true') {
                t = await Transaction.find({ sellerUsername: req.user.username });
                transactions = await Transaction.find({ sellerUsername: req.user.username }).sort('-updatedAt').limit(3).skip(parseInt(req.query.offset));
                return res.send({ transactions, limit: parseInt(req.query.offset) + 3 > t.length, total: t.length });
            }
            t = await Transaction.find({ customer: req.user._id });
            transactions = await Transaction.find({ customer: req.user._id }).sort('-updatedAt').limit(3).skip(parseInt(req.query.offset));
            return res.send({ transactions, limit: parseInt(req.query.offset) + 3 > t.length, total: t.length });
        } catch (error) {
            return res.send({ error: error.message });
        }
    },
    async indexByDate(req, res) {
        try {
            let transactions = [];
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDay();
            transactions = await Transaction.find({
                updatedAt: {
                    "$gte": new Date(year, month, day)
                },
                seller: req.user._id
            }).sort('-updatedAt');
            return res.send(transactions)
        } catch (error) {
            return res.send({ error: '' });
        }
    }
}
const Transaction = require('../Model/Transaction');
const moment = require('moment');

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
    async revenueIndex(req, res) {
        try {
            let transactions = [];
            let response = [];
            let responseObj = {};

            transactions = await Transaction.find({ seller: req.user._id, createdAt: { "$gte": moment().startOf('day') } });
            let amountOfDay = [];
            transactions.map(transaction => amountOfDay.push(transaction.amount));
            let sumOfTheDay = amountOfDay.reduce((acc, value) => acc + value, 0);
            responseObj = {period: 'Today', revenue: sumOfTheDay, amount: transactions.length };
            response = response.concat(responseObj);
            for(let i = 1; i <= 6; i++){
                let day = moment().subtract(i, 'days');
                let previousDay = moment().subtract(i+1, 'days');
                console.log(previousDay, day);
                transactions = await Transaction.find({ seller: req.user._id, createdAt: { "$gte": previousDay, "$lt": day } });
                amountOfDay = [];
                transactions.map(transaction => amountOfDay.push(transaction.amount));
                sumOfTheDay = amountOfDay.reduce((acc, value) => acc + value, 0);
                responseObj = {period: `${i} days ago`, revenue: sumOfTheDay, amount: transactions.length };
                response = response.concat(responseObj);
            }
            return res.send({revenues: response});
        } catch(error){
            return res.send({error: error.message});
        }
    },
    async index(req, res) {
        let year, day, month;
        let transactions = [];
        let t = [];
        if (req.query.option) {
            switch (req.query.option) {
                case '0':
                    let now = new Date();
                    year = now.getFullYear();
                    month = now.getMonth();
                    day = now.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
                    break;

                case '1':
                    let lastThreeDays = new Date(new Date() - 60 * 60 * 24 * 3 * 1000);
                    year = lastThreeDays.getFullYear();
                    month = lastThreeDays.getMonth();
                    day = lastThreeDays.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
                    break;

                case '2':
                    let lastWeek = new Date(new Date() - 60 * 60 * 24 * 7 * 1000);
                    year = lastWeek.getFullYear();
                    month = lastWeek.getMonth();
                    day = lastWeek.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
                    break;

                case '3':
                    let lastMonth = new Date(new Date() - 60 * 60 * 24 * 30 * 1000);
                    year = lastMonth.getFullYear();
                    month = lastMonth.getMonth();
                    day = lastMonth.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
                    break;

                case '4':
                    let lastSemester = new Date(new Date() - 60 * 60 * 24 * 182 * 1000);
                    year = lastSemester.getFullYear();
                    month = lastSemester.getMonth();
                    day = lastSemester.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
                    break;

                case '5':
                    let lastYear = new Date(new Date() - 60 * 60 * 24 * 365 * 1000);
                    year = lastYear.getFullYear();
                    month = lastYear.getMonth();
                    day = lastYear.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
                    break;

                default:
                    year = lastWeek.getFullYear();
                    month = lastWeek.getMonth();
                    day = lastWeek.getDay();
                    try {
                        transactions = await Transaction.find({
                            createdAt: {
                                "$gte": new Date(year, month, day)
                            },
                            seller: req.user._id
                        });
                        return res.send({ transactions });
                    } catch (error) {
                        return res.send({ error: error.message });
                    }
            }
        } else {
            try {
                if (req.query.seller === 'true') {
                    t = await Transaction.find({ seller: req.user._id });
                    transactions = await Transaction.find({ seller: req.user._id }).sort('-updatedAt').limit(6).skip(parseInt(req.query.offset));
                    return res.send({ transactions, limit: parseInt(req.query.offset) + 6 > t.length, total: t.length });
                }
                t = await Transaction.find({ customer: req.user._id });
                transactions = await Transaction.find({ customer: req.user._id }).sort('-updatedAt').limit(6).skip(parseInt(req.query.offset));
                return res.send({ transactions, limit: parseInt(req.query.offset) + 6 > t.length, total: t.length });
            } catch (error) {
                return res.send({ error: error.message });
            }
        }
    }
}
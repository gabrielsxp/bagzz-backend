var braintree = require("braintree");
const dotenv = require("dotenv").config();

var gateway = null;

if (process.env.PRODUCTION) {
    gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: process.env.BRAIN_TREE_MERCHANTID,
        publicKey: process.env.BRAIN_TREE_PUBLICKEY,
        privateKey: process.env.BRAIN_TREE_PRIVATEKEY
    });
} else {
    gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
        merchantId: "xxxxxxxxxxxxxx",
        publicKey: "xxxxxxxxxxxxxxxxx",
        privateKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    });
}

module.exports = {
    generateCustomerToken(req, res) {
        gateway.clientToken.generate({
            customerId: req.user.customerId
        }, (err, response) => {
            if (err) {
                return res.status(400).send({ error: err });
            }
            return res.send(response.clientToken);
        });
    },
    createCustomer(username, email) {
        return new Promise((resolve, reject) => {
            gateway.customer.create({
                firstName: username,
                email
            }, (err, response) => {
                resolve(response.customer.id);
                reject(err);
            });
        });
    },
    createPaymentMethod(req, res) {
        gateway.paymentMethodNonce.find(req.params.nonce, (err, paymentMethodNonce) => {
            if (err) {
                return res.send(err);
            } else {
                console.log(paymentMethodNonce);
                if (paymentMethodNonce.type === 'notFoundError') {
                    console.log('error not found method');
                    gateway.paymentMethod.create({
                        customerId: req.user.customerId,
                        paymentMethodNonce: req.params.nonce,
                        options: {
                            verifyCard: false,
                            verificationAmount: req.query.value
                        }
                    }, (err, result) => {
                        if (err) {
                            console.log('error creating payment method');
                            return res.send(err);
                        }
                        return res.send(result);
                    });
                } else {
                    return res.send(paymentMethodNonce.nonce);
                }
            }
        });
    },
    completePayment(req, res) {
        gateway.transaction.sale({
            amount: parseFloat(req.query.value).toFixed(2).toString(),
            paymentMethodNonce: req.params.nonce,
            options: {
                submitForSettlement: true
            }
        }, (err, result) => {
            console.log('Result.success: ' + result.success);
            if (result.success) {
                console.log('payment success ');
                return res.send({ success: true });
            } else {
                console.log('payment error');
                return res.send({ success: false });
            }
        });
    }
}
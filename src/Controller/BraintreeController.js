var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "h28cc49rc2g3qk8n",
    publicKey: "5bhmh37k8x277vjm",
    privateKey: "ae74f643f65abd3a6d7055f4e332905d"
});

module.exports = {
    generateCustomerToken(req, res){
        gateway.clientToken.generate({
            customerId: req.user.customerId
        }, (err, response) => {
            if(err){
                return res.status(400).send({error: err});
            }
            return res.send(response.clientToken);
        });
    },
    createCustomer(username, email){
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
    createPaymentMethod(req, res){
        gateway.paymentMethodNonce.find(req.params.nonce, (err, paymentMethodNonce) => {
            if(err){
                return res.send(err);
            } else {
                console.log(paymentMethodNonce);
                if(paymentMethodNonce.type === 'notFoundError'){
                    console.log('error not found method');
                    gateway.paymentMethod.create({
                        customerId: req.user.customerId,
                        paymentMethodNonce: req.params.nonce,
                        options: {
                            verifyCard: false,
                            verificationAmount: req.query.value
                        }}, (err, result) => {
                            if(err){
                                console.log('error creating payment method');
                                return res.send(err);
                            }
                            return res.send(result);
                        });
                } else {
                    console.log('Enter transaction section ' +  parseFloat(req.query.value).toFixed(2).toString());
                    gateway.transaction.sale({
                        amount: '1.00',
                        paymentMethodNonce: paymentMethodNonce.nonce,
                        options: {
                            submitForSettlement: true
                        }
                      }, (err, result) => {
                        console.log('Result.success: ' + result.success);
                        if (result.success) {
                        console.log('payment success ');
                          return res.send({success: true});
                        } else {
                          console.log('payment error');
                          return res.send({success: false});
                        }
                    });
                }
            }
        }); 
    }
}
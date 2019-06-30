const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const fs = require('fs');
const path = require('path');

/*
    Middleware de comunicação que implementa o mecanismo de autenticação utilizando Bearer Token
*/

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const privateKey = fs.readFileSync(path.join(__dirname, '..','Model','private.key'));
        const decoded = jwt.verify(token, privateKey);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});

        if(!user){
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch(error) {
        res.status(401).send({error: 'Please authenticate !'});
    }
}

module.exports = auth;
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

if (process.env.PRODUCTION) {
    mongoose.connect(`mongodb://${process.env.MONGOOSE_DB_USER}:${process.env.MONGOOSE_DB_PASSWORD}@${process.env.MONGOOSE_DB_URL}/paymedude`, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
} else {
    mongoose.connect('mongodb://127.0.0.1:27017/paymedude', {
    useNewUrlParser: true,
    useCreateIndex: true
});
}

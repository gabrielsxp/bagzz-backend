const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

console.log('begzz emv')
console.log(process.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  mongoose.connect(`mongodb://${process.env.MONGOOSE_DB_USER}:${process.env.MONGOOSE_DB_PASSWORD}@${process.env.MONGOOSE_DB_URL}/begzz`, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
} else {
  mongoose.connect('mongodb://127.0.0.1:27017/begzz', {
    useNewUrlParser: true,
    useCreateIndex: true
  });
}

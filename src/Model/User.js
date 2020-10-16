const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   validate(value) {
  //     value.replace(' ', '-');
  //   }
  // },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tokens: [{
    token: String
  }],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    }
  ]
}, { timestamps: true });

UserSchema.virtual('favorites_', {
  ref: 'Product',
  localField: 'favorites',
  foreignField: '_id'
});


UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  var privateKey = fs.readFileSync(path.join(__dirname, '/private.key'));
  console.log('Private Key: ' + privateKey);
  const token = await jwt.sign({ _id: user._id.toString() }, privateKey);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('This user do not exists !');
    }
    const matchPasswords = await bcrypt.compare(password, user.password);
    if (!matchPasswords) {
      throw new Error('Password incorrect !');
    }
    return user;
  } catch (error) {
    return new Error(error);
  }
}

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const BraintreeController  = require('../Controller/BraintreeController');

const UserSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        validate(value){
            value.replace(' ','-');
        }
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    sex: Boolean,
    tokens: [{
        token: String
    }],
    numberOfPosts: {type: Number, default: 0},
    subscriptions: {type: Number, default: 0},
    bannerColor: {type: String, default: '#dedede'},
    fontColor: {type: String, default: '#333'},
    borderColor: {type: String, default: '#333'},
    image: String,
    fullImage: String,
    customerId: {type: String, default: ''},
    bio: {type: String, default: null},
    creator: {type: Boolean, default: false},
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Post',
            default: null
        }
    ],
    creators: [{
        type: String,
        default: null
    }],
    unlockedPosts: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        default: null
    }],
    accountLevel: {type: Number, default: 0},
}, {timestamps: true});

UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

UserSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'author'
});

UserSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'likedBy'
})

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

UserSchema.statics.findByCredentials = async function (username, password) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('This user do not exists !');
        }
        const matchPasswords = await bcrypt.compare(password, user.password);
        if(!matchPasswords){
            throw new Error('Password incorrect !');
        }
        return user;
    } catch(error){
        return new Error(error);
    }
}

UserSchema.pre('save', async function (next) {
    const user = this;
    const maxImages = 1;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    if (user.isModified('sex')) {
        user.image = (user.sex === true ? 'male/' : 'female/') + Math.floor(Math.random() * (maxImages - 1) + 1) + '-s.png';
        user.fullImage = (user.sex === true ? 'male/' : 'female/') + Math.floor(Math.random() * (maxImages - 1) + 1) + '.png';
    }
    user.customerId = await BraintreeController.createCustomer(user.username, user.email);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
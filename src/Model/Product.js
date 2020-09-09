const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    name: String,
    descript: String,
    style: String,
    price: String,
    weight: Number,
    x: Number,
    y: Number,
    z: Number,
    mainImage: String,
    active: {
        type: Number,
        default: 1
    },
    images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
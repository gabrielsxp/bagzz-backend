const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
    likedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    belongsTo: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
}, {timestamps: true});

module.exports = mongoose.model('Like', LikeSchema);
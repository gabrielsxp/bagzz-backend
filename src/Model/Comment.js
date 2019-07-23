const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: String,
    referedTo: {type: mongoose.Schema.Types.ObjectId},
    replyTo: {type: mongoose.Schema.Types.ObjectId, default: null},
    author: {type: mongoose.Schema.Types.ObjectId},
    username: String,
    userImage: String,
    replies: [],
    root: {type: Boolean, default: true},
    relative: {type: String, default: null}
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);
const mongoose = require('mongoose');

const CommentSchema = ({
    title: String,
    content: String,
    referedTo: {type: mongoose.Schema.Types.ObjectId},
    author: {type: mongoose.Schema.Types.ObjectId}
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);
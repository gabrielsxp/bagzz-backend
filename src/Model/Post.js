const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: String,
    content: String,
    likes: {type: Number, default: 0},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorImage: String,
    authorEmail: String,
    username: String,
    postValue: {type: Number, default: 1},
    youtubeVideoUrl: {type: String, default: null},
    category: {type: String, default: 'public'},
}, {timestamps: true});

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'referedTo'
});

module.exports = mongoose.model('Post', PostSchema);
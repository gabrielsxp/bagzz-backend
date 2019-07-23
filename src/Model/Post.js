const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: String,
    content: String,
    likes: {type: Number, default: 0},
    comments: {type: Number, default: 0},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorImage: String,
    authorEmail: String,
    username: String,
    postValue: {type: Number, default: 1},
    youtubeVideoUrl: {type: String, default: null},
    fullImage: {type: String, default: null},
    image: {type: String, default: null},
    imageDescription: {type: String, defaut: null}, 
    category: {type: String, default: 'public'},
    relative: String,
    relativeUpdated: String,
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);
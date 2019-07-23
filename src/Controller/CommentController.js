const Comment = require('../Model/Comment');
const moment = require('moment');
const Post = require('../Model/Post');

module.exports = {
    async comment(req, res){
        try {
            const comment = new Comment({
                ...req.body,
                relative: moment(new Date()).fromNow()
            })
            await comment.save();
            
            const post = await Post.findById(req.body.referedTo);
            post.comments++;
            await post.save();
            return res.send({comment});
        } catch(error){
            return res.send({error: error.message});
        }
    },
    async index(req, res){
        try {
            const comments = await Comment.find({referedTo: req.params.id, root: true }).sort('-createdAt');
            for(const comment of comments){
                let replies = await Comment.find({replyTo: comment._id});
                comment.replies = replies;
            }
            return res.send({comments});
        } catch(error){
            return res.send({error: error.message});
        }
    },
    async delete(req, res){
        try {
            const comment = await Comment.findById(req.params.commentId);
            comment.content = null;
            await comment.save();
            return res.send({comment});
        } catch(error){
            return res.send({error: error.message});
        }
    }
}
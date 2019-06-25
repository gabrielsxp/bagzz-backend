const Post = require('../Model/Post');
const User = require('../Model/User');
module.exports = {
    async store(req, res) {
        //return res.status(400).send({error: 'Haha'});
        const user = req.user;
        try {
            const post = await Post.create(req.body);
            if (!post) {
                return res.status(400).send({ error: 'Something went wrong on creation of the post !' });
            }
            user.numberOfPosts = user.numberOfPosts + 1;
            await user.save();
            return res.status(201).send({ post });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    async index(req, res) {
        const user = req.user;
        const creators = user.creators;
        let allPosts = [];
        try {
            for (let i = 0; i < creators.length; i++) {
                const user = await User.findOne({ username: creators[i]}).populate('posts');
                allPosts = allPosts.concat(user.posts);
            }
            const posts = allPosts.filter(post => post.category === req.query.category).splice(req.query.offset, 6);
            return res.status(200).send({ posts, limit: allPosts.length < parseInt(req.query.offset) });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    async userPosts(req, res) {
        console.log(req.query);
        try {
            const posts = await Post.find({ username: req.params.user }).limit(6).skip(parseInt(req.query.offset));
            /*
            const user = await User.findOne({ username: req.params.user }).populate('posts').sort('-createdAt');
            const posts = user.posts.filter((post) => post.category === 'public').splice(req.query.offset, 6);
            */
            return res.send({ posts, limit: posts.length < parseInt(req.query.offset) });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    },
    async likePost(req, res) {
        const idPost = req.params.id;
        const user = req.user;
        try {
            const post = await Post.findById(idPost);
            post.likes = post.likes + 1;
            user.likedPosts = user.likedPosts.concat(idPost);
            await user.save();
            await post.save();
            return res.send({ post, user });
        } catch (error) {
            return res.send({ error });
        }
    },
    async unlikePost(req, res) {
        const idPost = req.params.id;
        const user = req.user;
        try {
            const post = await Post.findById(idPost);
            const likedPosts = user.likedPosts;

            post.likes = post.likes - 1;
            console.log(likedPosts);
            const index = likedPosts.findIndex((element) => element == idPost);
            console.log(index);
            user.likedPosts.splice(index, 1);
            await user.save();
            await post.save();
            return res.send({ post, user });
        } catch (error) {
            return res.send({ error });
        }
    }
}
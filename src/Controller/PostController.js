const Post = require('../Model/Post');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const moment = require('moment');

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}

module.exports = {
    async store(req, res) {
        const user = req.user;
        try {
            let fileName = null;
            if (req.file) {
                const { filename: image } = req.file;
                const [name] = image.split('.');
                const hash = hashCode(name);
                fileName = `${user._id + hash}.png`;
                await sharp(req.file.path)
                    .resize(1280, 1024)
                    .png()
                    .toFile(
                        path.resolve(req.file.destination, 'resized', fileName)
                    );
                await sharp(req.file.path)
                    .resize(480, 360)
                    .png()
                    .toFile(
                        path.resolve(req.file.destination, 'mini', fileName)
                    );
                fs.unlinkSync(req.file.path);
            }
            const post = await Post.create({ ...req.body, image: `uploads/mini/${fileName}`, fullImage: `uploads/resized/${fileName}` });
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
                const posts = await Post.find({ username: creators[i], category: req.query.category }).sort('-createdAt');
                for(const post of posts){
                    post.relative = moment(post.createdAt).format('MMM DD');
                }
                allPosts = allPosts.concat(posts);
            }
            const posts = allPosts.filter(post => post.category === req.query.category).splice(parseInt(req.query.offset), 6);
            return res.status(200).send({ posts, limit: parseInt(req.query.offset) + 6 >= allPosts.length });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    async userPosts(req, res) {
        try {
            const posts = await Post.find({ username: req.params.user, category: req.query.category }).limit(6).skip(parseInt(req.query.offset)).sort('-updatedAt');
            const allPosts = await Post.find({ username: req.params.user, category: req.query.category });
            return res.send({ posts, limit: parseInt(req.query.offset) + 6 >= allPosts.length });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    },
    async getAllPosts(req, res) {
        try {
            const posts = await Post.find({ username:req.user.username, category: `${req.params.category}`})
            return res.send({posts});
        } catch(error){
            return res.send({error: error.message});
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
    async getPost(req, res) {
        try {
            const post = await Post.findById(req.params.postId);
            post.relative = moment(post.createdAt).format('MMM DD');
            post.relativeUpdated = moment(post.updatedAt).format('MMM DD');
            if (!post) {
                return res.status(404).send({ error: 'Post not found' });
            }
            return res.send({ post });
        } catch (error) {
            return res.send({ error: error.message });
        }
    },
    async editPost(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).send({ error: 'Post not found' });
            }
            let fileName = null;
            if (req.file) {
                const { filename: image } = req.file;
                const [name] = image.split('.');
                const hash = hashCode(name);
                fileName = `${req.user._id + hash}.png`;
                await sharp(req.file.path)
                    .resize(1280, 1024)
                    .png()
                    .toFile(
                        path.resolve(req.file.destination, 'resized', fileName)
                    );
                await sharp(req.file.path)
                    .resize(480, 360)
                    .png()
                    .toFile(
                        path.resolve(req.file.destination, 'mini', fileName)
                    );
                fs.unlinkSync(req.file.path);
            }
            const changes = Object.keys(req.body);
            changes.forEach(update => post[update] = req.body[update]);
            post.image = `uploads/mini/${fileName}`;
            post.fullImage =  `uploads/resized/${fileName}`;

            await post.save();
            return res.send({ post });
        } catch (error) {
            console.log(error);
            return res.send({ error: error.message });
        }
    },
    async deletePost(req, res) {
        try {
            const index = req.user.likedPosts.findIndex((post) => post._id === req.params.id);
            if (index) {
                req.user.likedPosts.splice(index, 1);
            }
            await Post.findByIdAndDelete(req.params.id);
            req.user.numberOfPosts--;
            await req.user.save();
            return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.send({ error: error.message });
        }
    },
    async unlikePost(req, res) {
        const idPost = req.params.id;
        const user = req.user;
        try {
            const post = await Post.findById(idPost);
            const likedPosts = user.likedPosts;

            post.likes = post.likes - 1;
            const index = likedPosts.findIndex((element) => element == idPost);
            user.likedPosts.splice(index, 1);
            await user.save();
            await post.save();
            return res.send({ post, user });
        } catch (error) {
            return res.send({ error });
        }
    }
}
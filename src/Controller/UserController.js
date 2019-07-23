const User = require('../Model/User');
const Post = require('../Model/Post');
const TransactionController = require('./TransactionController');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}

module.exports = {
    async signUp(req, res) {
        const validFields = ['username', 'email', 'password', 'sex', 'creator'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));
        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields !' });
        }
        try {
            const user = await User.create(req.body);
            if (user) {
                const token = await user.generateAuthToken();
                return res.status(201).send({ user, token });
            } else {
                return res.status(400).send({ error: 'This email are already in use' });
            }
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    },
    async signIn(req, res) {
        const validFields = ['username', 'password'];
        const fields = Object.keys(req.body);
        const isValidFields = fields.every((field) => validFields.includes(field));
        if (!isValidFields) {
            return res.status(400).send({ error: "Invalid Fields" });
        }
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password);
            console.log(user);
            if (!user) {
                return res.status(400).send({ error: 'User not found' })
            }
            const token = await user.generateAuthToken();
            return res.status(200).send({ user, token });
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    async findUser(req, res) {
        const username = req.body.username;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.send({ user: false });
            }
            return res.send({ user: true });
        } catch (error) {
            return res.status(500).send({ error: error });
        }
    },
    async findEmail(req, res) {
        const email = req.body.email;
        console.log(email);
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.send({ user: false });
            }
            return res.send({ user: true });
        } catch (error) {
            return res.status(500).send({ error: error });
        }
    },
    async retrieveUserData(req, res) {
        return res.send({ user: req.user });
    },
    async fakeUsers(req, res) {
        let creators = [];
        for (let i = 0; i < 100; i++) {
            let dummy = Math.random().toString(36).substr(2, 9);
            let username = dummy;
            let email = `${dummy}@email.com`;
            let password = '123456';
            let sex = true;
            let creator = true;
            try {
                const user = await User.create({
                    username, email, password, sex, creator
                });
                creators = creators.concat(user);
            } catch (error) {
                return res.status(500).send({ error: error.message });
            }
        }
        return res.status(201).send({ creators });
    },
    async getCreators(req, res) {
        let total = 0;
        let creators = [];
        try {
            total = await User.countDocuments({});
            console.log(total);
            if (req.query.search) {
                const stringSearch = req.query.search;
                let creators = null;
                if (stringSearch !== '') {
                    creators = await User.findOne({ creator: true, username: { $regex: new RegExp(stringSearch), $options: 'i' } });
                } else {
                    creators = await User.find({ creator: true }).skip(parseInt(req.query.offset)).limit(6);
                }
                return res.send({ creators: creators || [] });
            }
            if (req.query.sort) {
                switch (req.query.sort) {
                    case '1':
                        creators = await User.find({ creator: true }).skip(parseInt(req.query.offset)).limit(6).sort('-subscriptions');
                        break;
                    case '2':
                        creators = await User.find({ creator: true }).skip(parseInt(req.query.offset)).limit(6).sort('-numberOfPosts');
                        break;
                    case '3':
                        creators = await User.find({ creator: true }).skip(parseInt(req.query.offset)).limit(6).sort('-createdAt');
                        break;
                    default:
                        break;
                }
                return res.send({ creators, limit: (total <= parseInt(req.query.offset) + 6) });
            } else {
                creators = await User.find({ creator: true }).skip(parseInt(req.query.offset)).limit(6).sort('-subscriptions');
                //creators.map((creator) => console.log(creator.username));
                return res.send({ creators, limit: (total <= parseInt(req.query.offset) + 6) });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error });
        }
    },
    async subscribe(req, res) {
        try {
            const user = req.user;
            const creator = await User.findOne({ username: req.body.creator });

            user.creators = user.creators.concat(req.body.creator);
            creator.subscriptions = creator.subscriptions + 1;

            await user.save();
            await creator.save();

            return res.send({ user });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    async unsubscribe(req, res) {
        try {
            const user = req.user;
            const creator = await User.findOne({ username: req.body.creator });

            const creators = user.creators;
            const index = creators.findIndex((element) => element == req.body.creator);
            user.creators.splice(index, 1);

            creator.subscriptions = creator.subscriptions - 1;

            await user.save();
            await creator.save();

            return res.send({ user });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.message });
        }
    },
    async getMe(req, res) {
        return res.send({ user: req.user });
    },
    async getUserProfile(req, res) {
        try {
            const user = await User.findOne({ username: req.params.user }).populate('posts');
            return res.send({ profile: user });
        } catch (error) {
            return res.send({ error: error.message });
        }
    },
    async updateUserProfile(req, res) {
        console.log('entrei aqui nego')
        try {

            const user = await User.findOne({ username: req.params.user });
            const posts = await Post.find({ username: req.params.user });
            const updates = Object.keys(req.body);
            updates.forEach((update) => user[update] = req.body[update]);

            if (req.file) {
                const { filename: image } = req.file;
                const [name] = image.split('.');
                const hash = hashCode(name);
                const fullImage = `${req.user.username + hash}.png`;
                console.log(fullImage);
                await sharp(req.file.path)
                    .resize(180, 180)
                    .png()
                    .toFile(
                        path.resolve(req.file.destination, 'resized', fullImage)
                    );
                await sharp(req.file.path)
                    .resize(60, 60)
                    .png()
                    .toFile(
                        path.resolve(req.file.destination, 'mini', fullImage)
                    );
                fs.unlinkSync(req.file.path);
                user.fullImage = `uploads/resized/${fullImage}`;
                user.image = `uploads/mini/${fullImage}`;
                if (posts.length > 0) {
                    for (const post of posts) {
                        console.log(post);
                        post.authorImage = `uploads/mini/${fullImage}`;
                        await post.save();
                    }
                }
            }

            await user.save();
            return res.send({ user });
        } catch (error) {
            console.log(error);
            return res.send({ error: error.message });
        }
    },
    async patchUser(req, res) {
        const user = req.user;
        try {
            user.unlockedPosts = user.unlockedPosts.concat(req.query.post);
            let post = [];
            let postNames = [];
            post.push(req.query.post);
            postNames.push(req.body.productNames);
            await TransactionController.store(req.user._id, req.user.username, req.user.email, req.body.sellerId, req.body.sellerUsername, req.body.sellerEmail, req.body.amount, post, postNames);
            await user.save();
            return res.send({ user });

        } catch (error) {
            return res.send({ error: error.message });
        }
    }
}
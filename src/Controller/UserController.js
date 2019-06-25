const User = require('../Model/User');

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
        console.log(req.query);
        const count = 100;
        let creators = [];
        try {
            if (req.query.search) {
                const stringSearch = req.query.search;
                let creators = null;
                if (stringSearch !== '') {
                    creators = await User.findOne({ creator: true, username: req.query.search.toLowerCase().trim() });
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
                return res.send({ creators, limit: count <= parseInt(req.query.offset) + 6 });
            } else {
                creators = await User.find({ creator: true }).skip(parseInt(req.query.offset)).limit(6).sort('-subscriptions');
                //creators.map((creator) => console.log(creator.username));
                return res.send({ creators, limit: count <= parseInt(req.query.offset) + 6 });
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
        try {
            const user = await User.findOne({ username: req.params.user });
            const updates = Object.keys(req.body);
            updates.forEach((update) => user[update] = req.body[update]);
            await user.save();
            return res.send({ user });
        } catch(error){
            return res.send({error: error.message});
        }
    }
}
const Category = require('../Model/Category');

const globalReturn = {
    error: 0,
    data: []
}

module.exports = {
    async create(req, res) {
        const validator = [
            'active',
            'name',
            'image'
        ];
        const body = req.body;
        const valid = Object.keys(body).every(key => validator.includes(key))
        if (valid) {
            try {
                const category = await Category.create(req.body)
                if (category) {
                    return res.status(201).send({ ...globalReturn, error: 0, data: { category } });
                } else {
                    return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to create this project right now' } })
                }
            } catch (error) {
                return res.status(500).send({ ...globalReturn, error: 1, data: { error } })
            }
        } else {
            return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } });
        }
    },
    async index(req, res) {
        try {
            console.log(req.query.page);
            const categories = await Category.find({ active: 1 }).limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-name');
            console.log('categories found:', categories.length)
            if (categories) {
                return res.status(200).send({ ...globalReturn, data: { categories, total: categories.length } });
            }
        } catch (error) {
            return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the categories list right now' } });
        }
    },
    async getOne(req, res) {
        try {
            const category = await Category.findById(req.params.id);
            if (category) {
                return res.status(200).send({ ...globalReturn, data: { category } });
            } else {
                return res.status(404).send({ ...globalReturn, data: { error: 'This category does not exists' } });
            }
        } catch (error) {
            return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this category' } });
        }
    },
    async change(req, res) {
        const validator = [
            'active',
            'name',
            'image'
        ];
        const body = req.body;
        const valid = Object.keys(body).every(key => validator.includes(key))
        if (!valid) {
            return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
        }
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this category index' } });
            }
            const changes = Object.keys(req.body);
            changes.forEach(update => category[update] = req.body[update]);

            await category.save();
            return res.send({ ...globalReturn, data: { category } });
        } catch (error) {
            console.log(error);
            return res.send({ error: error.message });
        }
    },
    async remove(req, res) {
        try {
            await Category.findByIdAndDelete(req.params.id);
            return res.status(200).send({ ...globalReturn, data: { success: true } });
        } catch (error) {
            return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this category right now' } });
        }
    },
    async clear(req, res) {
        try {
            await Category.deleteMany({});
            return res.status(200).send({ ...globalReturn, data: { success: true } });
        } catch (error) {
            return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this categorys right now' } });
        }
    },
}
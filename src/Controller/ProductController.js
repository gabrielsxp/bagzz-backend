const Product = require('../Model/Product');
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
      'description',
      'style',
      'price',
      'weight',
      'x',
      'y',
      'z',
      'mainImage',
      'category',
      'images'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      try {
        const product = await Product.create(req.body)
        if (product) {
          return res.status(201).send({ ...globalReturn, error: 0, data: { product } });
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
      const products = await Product.find({ active: 1 }).limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt');
      console.log('Products found:', products.length)
      if (products) {
        return res.status(200).send({ ...globalReturn, data: { products, total: products.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the products list right now' } });
    }
  },
  async indexByCategory(req, res) {
    try {
      const categoryFound = await Category.findOne({ name: req.params.category });
      console.log(categoryFound);
      if (categoryFound) {
        const products = await Product.find({ active: 1, category: categoryFound._id }).limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt');
        console.log('Products found:', products.length)
        if (products) {
          return res.status(200).send({ ...globalReturn, data: { products, total: products.length } });
        }
      } else {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Category not found !' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the products list right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        return res.status(200).send({ ...globalReturn, data: { product } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This product does not exists' } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this product' } });
    }
  },
  async change(req, res) {
    const validator = [
      'active',
      'name',
      'description',
      'style',
      'price',
      'weight',
      'x',
      'y',
      'z',
      'mainImage',
      'category',
      'images'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this product index' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => product[update] = req.body[update]);

      await product.save();
      return res.send({ ...globalReturn, data: { product } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this product right now' } });
    }
  },
  async clear(req, res) {
    try {
      await Product.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this products right now' } });
    }
  },
}
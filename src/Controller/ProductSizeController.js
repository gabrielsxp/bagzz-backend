const ProductSize = require('../Model/ProductSize');
const moment = require('moment');

const globalReturn = {
  error: 0,
  data: []
}

module.exports = {
  async create(req, res) {
    const validator = [
      'name',
      'description',
      'uri',
      'valueFlutuation',
      'chest',
      'waist',
      'hips'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      try {
        const productSize = await ProductSize.create(req.body);
        if (productSize) {
          return res.status(201).send({ ...globalReturn, error: 0, data: { productSize } });
        } else {
          return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to create this project right now' } });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).send({ ...globalReturn, error: 1, data: { error } });
      }
    } else {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } });
    }
  },
  async index(req, res) {
    try {
      console.log(req.query.page);
      const now = moment();
      const productSizes = await ProductSize.find({}).populate('products').limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt').exec();
      console.log('ProductSizes found:', productSizes.length)
      if (productSizes) {
        return res.status(200).send({ ...globalReturn, data: { productSizes, total: productSizes.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the productSizes list right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const productSize = await ProductSize.findById(req.params.id).populate('products').exec();
      if (productSize) {
        return res.status(200).send({ ...globalReturn, data: { productSize } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This productSize does not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this productSize' } });
    }
  },
  async change(req, res) {
    const validator = [
      'name',
      'description',
      'uri',
      'valueFlutuation',
      'chest',
      'waist',
      'hips'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const productSize = await ProductSize.findById(req.params.id);
      if (!productSize) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this productSize' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => productSize[update] = req.body[update]);

      await productSize.save();
      return res.send({ ...globalReturn, data: { productSize } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      await ProductSize.findByIdAndDelete(req.params.id);
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stockright now' } });
    }
  },
  async clear(req, res) {
    try {
      await ProductSize.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this productSizes right now' } });
    }
  },
}
const ProductColor = require('../Model/ProductColor');
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
      'valueFlutuation'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      try {
        const productColor = await ProductColor.create(req.body);
        if (productColor) {
          return res.status(201).send({ ...globalReturn, error: 0, data: { productColor } });
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
      const productColors = await ProductColor.find({}).populate('products').limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt').exec();
      console.log('ProductColors found:', productColors.length)
      if (productColors) {
        return res.status(200).send({ ...globalReturn, data: { productColors, total: productColors.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the productColors list right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const productColor = await ProductColor.findById(req.params.id).populate('products').exec();
      if (productColor) {
        return res.status(200).send({ ...globalReturn, data: { productColor } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This productColor does not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this productColor' } });
    }
  },
  async change(req, res) {
    const validator = [
      'name',
      'description',
      'uri',
      'valueFlutuation'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const productColor = await ProductColor.findById(req.params.id);
      if (!productColor) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this productColor' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => productColor[update] = req.body[update]);

      await productColor.save();
      return res.send({ ...globalReturn, data: { productColor } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      await ProductColor.findByIdAndDelete(req.params.id);
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stockright now' } });
    }
  },
  async clear(req, res) {
    try {
      await ProductColor.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this productColors right now' } });
    }
  },
}
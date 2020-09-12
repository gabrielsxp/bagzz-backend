const Stock = require('../Model/Stock');
const Product = require('../Model/Product');
const mongoose = require('mongoose');

const globalReturn = {
  error: 0,
  data: []
}

module.exports = {
  async create(req, res) {
    const validator = [
      'product',
      'color',
      'size',
      'amount',
      'images'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      const validProduct = await Product.findById(req.body.product);
      if (validProduct) {
        const cannotCreate = await Stock.findOne({ product: validProduct, color: req.body.color, size: req.body.size });
        if (cannotCreate) {
          return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'A stock for this product already exists with this color and size !' } });
        } else {
          const stock = await Stock.create(req.body);
          return res.status(201).send({ ...globalReturn, data: { stock } });
        }
      } else {
        return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'This product does not exists' } });
      }
    } else {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } });
    }
  },
  async index(req, res) {
    try {
      console.log(req.query.page);
      const stocks = await Stock.find({}).populate('product').populate('size').populate('color').limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt').exec();
      console.log('Stocks found:', stocks.length)
      if (stocks) {
        return res.status(200).send({ ...globalReturn, data: { stocks, total: stocks.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the stocks list right now' } });
    }
  },
  async indexOfProduct(req, res) {
    try {
      console.log(req.query.page);
      const stocks = await Stock.find({ product: mongoose.Types.ObjectId(req.query.product) }).populate('product').populate('size').populate('color').limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt').exec();
      console.log('Stocks found:', stocks.length)
      if (stocks) {
        return res.status(200).send({ ...globalReturn, data: { stocks, total: stocks.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the stocks list right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const stock = await Stock.findById(req.params.id).populate('product').populate('size').populate('color').exec();
      if (stock) {
        return res.status(200).send({ ...globalReturn, data: { stock } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This stock does not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this stock' } });
    }
  },
  async change(req, res) {
    const validator = [
      'product',
      'color',
      'size',
      'amount',
      'images'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const stock = await Stock.findById(req.params.id);
      if (!product) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this stockindex' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => product[update] = req.body[update]);

      await product.save();
      return res.send({ ...globalReturn, data: { stock } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      await Stock.findByIdAndDelete(req.params.id);
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stockright now' } });
    }
  },
  async clear(req, res) {
    try {
      await Stock.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stocks right now' } });
    }
  },
}
const Discount = require('../Model/Discount');
const moment = require('moment');
const mongoose = require('mongoose');

const globalReturn = {
  error: 0,
  data: []
}

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}

module.exports = {
  async create(req, res) {
    const validator = [
      'value',
      'keyword',
      'user',
      'category',
      'products',
      'banner',
      'global',
      'startDate',
      'endDate',
      'reedemable',
      'minValue'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      try {
        const keyword = req.body.keyword ? req.body.keyword : hashCode(req.body.startDate + req.body.endDate + moment(new Date()).format('YYYY-MM-DDTHH:MM:ss').toString());
        let start = moment(new Date(req.body.startDate)).format('YYYY-MM-DDTHH:MM:ss');
        let end = moment(new Date(req.body.endDate)).format('YYYY-MM-DDTHH:MM:ss');
        const discount = await Discount.create({ ...req.body, keyword, startDate: start, endDate: end });
        if (discount) {
          return res.status(201).send({ ...globalReturn, error: 0, data: { discount } });
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
      const discounts = await Discount.find({ reedemable: true, user: mongoose.Types.ObjectId(req.user._id), startDate: { $lte: now.toString() }, endDate: { $gte: now.toString() } }).limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt');
      console.log('Discounts found:', discounts.length)
      if (discounts) {
        return res.status(200).send({ ...globalReturn, data: { discounts, total: discounts.length } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the discountslist right now' } });
    }
  },
  async globalIndex(req, res) {
    try {
      console.log(req.query.page);
      const now = moment();
      const discounts = await Discount.find({ global: true, startDate: { $lte: now.toString() }, reedemable: false, endDate: { $gte: now.toString() } }).limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-value');
      console.log('Discounts found:', discounts.length)
      if (discounts) {
        return res.status(200).send({ ...globalReturn, data: { discounts, total: discounts.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the discountslist right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const discount = await Discount.findById(req.params.id).populate('products').exec();
      if (discount) {
        return res.status(200).send({ ...globalReturn, data: { discount } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This discountdoes not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this discount' } });
    }
  },
  async getDiscountByKeyword(req, res) {
    try {
      const now = moment();
      const discount = await Discount.find({ keyword: { $regex: new RegExp(`^${req.params.keyword}$`, 'i') }, startDate: { $lte: now.toString() }, endDate: { $gte: now.toString() } });
      if (discount) {
        return res.status(200).send({ ...globalReturn, data: { discount } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This discount does not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this discount' } });
    }
  },
  async change(req, res) {
    const validator = [
      'value',
      'keyword',
      'user',
      'category',
      'products',
      'banner',
      'global',
      'startDate',
      'endDate',
      'reedemable',
      'minValue'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const discount = await Discount.findById(req.params.id);
      if (!discount) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this discount' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => discount[update] = req.body[update]);

      await discount.save();
      return res.send({ ...globalReturn, data: { discount } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      await Discount.findByIdAndDelete(req.params.id);
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stockright now' } });
    }
  },
  async clear(req, res) {
    try {
      await Discount.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this discountsright now' } });
    }
  },
}
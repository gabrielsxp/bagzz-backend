const Address = require('../Model/Address');
const moment = require('moment');
const mongoose = require('mongoose');

const globalReturn = {
  error: 0,
  data: []
}

module.exports = {
  async create(req, res) {
    const validator = [
      'name',
      'type',
      'street',
      'district',
      'number',
      'postalCode',
      'city',
      'state'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      try {
        const address = await Address.create({ ...req.body, user: req.user._id });
        if (address) {
          return res.status(201).send({ ...globalReturn, error: 0, data: { address } });
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
      const now = moment();
      const addresses = await Address.find({ user: req.user._id }).populate('products').limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt').exec();
      console.log('Addresss found:', addresses.length)
      if (addresses) {
        return res.status(200).send({ ...globalReturn, data: { addresses, total: addresses.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the addresses list right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const address = await Address.findById(req.params.id).populate('products').exec();
      if (address) {
        return res.status(200).send({ ...globalReturn, data: { address } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This addressdoes not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this address' } });
    }
  },
  async change(req, res) {
    const validator = [
      'name',
      'type',
      'street',
      'district',
      'number',
      'postalCode',
      'city',
      'state'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this address' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => address[update] = req.body[update]);

      await address.save();
      return res.send({ ...globalReturn, data: { address } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      let result = await Address.findOneAndDelete({ _id: req.params.id, user: mongoose.Types.ObjectId(req.user._id) });
      console.log(result);
      if (result) {
        return res.status(200).send({ ...globalReturn, data: { success: true } });
      } else {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Address not found' } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stockright now' } });
    }
  },
  async clear(req, res) {
    try {
      await Address.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this addresses right now' } });
    }
  },
}
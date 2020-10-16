const Banner = require('../Model/Banner');
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
      'text',
      'image',
      'startDate',
      'endDate',
      'products',
      'textEnabled'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (valid) {
      try {
        let start = moment(new Date(req.body.startDate)).format('YYYY-MM-DDTHH:MM:ss');
        let end = moment(new Date(req.body.endDate)).format('YYYY-MM-DDTHH:MM:ss');
        const banner = await Banner.create({ ...req.body, startDate: start, endDate: end });
        if (banner) {
          return res.status(201).send({ ...globalReturn, error: 0, data: { banner } });
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
      const banners = await Banner.find({ startDate: { $lte: now.toString() }, endDate: { $gte: now.toString() } }).populate('products').limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt').exec();
      console.log('Banners found:', banners.length)
      if (banners) {
        return res.status(200).send({ ...globalReturn, data: { banners, total: banners.length } });
      }
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the banners list right now' } });
    }
  },
  async getOne(req, res) {
    try {
      const banner = await Banner.findById(req.params.id).populate('products').exec();
      if (banner) {
        return res.status(200).send({ ...globalReturn, data: { banner } });
      } else {
        return res.status(404).send({ ...globalReturn, data: { error: 'This banner does not exists' } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get this banner' } });
    }
  },
  async change(req, res) {
    const validator = [
      'name',
      'description',
      'text',
      'image',
      'startDate',
      'endDate',
      'products',
      'textEnabled'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const banner = await Banner.findById(req.params.id);
      if (!banner) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this banner' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => banner[update] = req.body[update]);

      await banner.save();
      return res.send({ ...globalReturn, data: { banner } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  },
  async remove(req, res) {
    try {
      await Banner.findByIdAndDelete(req.params.id);
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this stockright now' } });
    }
  },
  async clear(req, res) {
    try {
      await Banner.deleteMany({});
      return res.status(200).send({ ...globalReturn, data: { success: true } });
    } catch (error) {
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to remove this banners right now' } });
    }
  },
}
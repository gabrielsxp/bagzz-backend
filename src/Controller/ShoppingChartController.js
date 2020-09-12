const ShoppingChart = require('../Model/ShoppingChart');
const moment = require('moment');

const globalReturn = {
  error: 0,
  data: []
}

module.exports = {
  async index(req, res) {
    try {
      const shoppingCharts = await ShoppingChart.findOne({ user: req.user._id }).populate('user').exec();
      if (shoppingCharts) {
        return res.status(200).send({ ...globalReturn, data: { shoppingCharts, total: shoppingCharts.length } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ...globalReturn, error: 1, data: { error: 'Unable to get the shoppingCharts list right now' } });
    }
  },
  async change(req, res) {
    const validator = [
      'products'
    ];
    const body = req.body;
    const valid = Object.keys(body).every(key => validator.includes(key))
    if (!valid) {
      return res.status(400).send({ ...globalReturn, error: 1, data: { error: 'Invalid fields' } })
    }
    try {
      const shoppingChart = await ShoppingChart.findById(req.params.id);
      if (!product) {
        return res.status(404).send({ ...globalReturn, error: 1, data: { error: 'Unable to find this shoppingChart' } });
      }
      const changes = Object.keys(req.body);
      changes.forEach(update => product[update] = req.body[update]);

      await product.save();
      return res.send({ ...globalReturn, data: { shoppingChart } });
    } catch (error) {
      console.log(error);
      return res.send({ error: error.message });
    }
  }
}
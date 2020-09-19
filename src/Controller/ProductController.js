const Product = require('../Model/Product');
const Category = require('../Model/Category');
var parser = require('xml-js');
const axios = require('axios');

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
        const hash = hashCode(req.body.name);
        const uri = `${req.body.name}_${hash}`;
        const product = await Product.create({ ...req.body, uri });
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
  async indexByName(req, res) {
    try {
      const products = await Product.find({ name: req.params.name }).limit(parseInt(req.query.limit)).skip(parseInt((req.query.limit) * (req.query.page - 1))).sort('-updatedAt');
      console.log('Products found:', products.length)
      if (products) {
        return res.status(200).send({ ...globalReturn, data: { products, total: products.length } });
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
  async calculatePostalService(req, res) {
    console.log(req.body);
    let data = {
      postalCodeOrigin: '74223042',
      postalCodeDestiny: req.body.postalCodeDestiny,
      x: req.body.x,
      y: req.body.y,
      z: req.body.z,
      weight: req.body.weight
    }
    switch (req.body.typeOfService) {
      case 'SEDEX':
        data = { ...data, serviceCode: 40010 }
        break;
      case 'PAC':
        data = { ...data, serviceCode: 41106 }
        break;
      default:
        data = { ...data, serviceCode: 41106 }
        break;
    }
    const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem=${data.postalCodeOrigin}&sCepDestino=${data.postalCodeDestiny}&nVlPeso=${data.weight}&nCdFormato=1&nVlComprimento=${data.z}&nVlAltura=${data.y}&nVlLargura=${data.x}&nVlValorDeclarado=${0}&sCdAvisoRecebimento=n&nCdServico=${data.serviceCode}&nVlDiametro=0&StrRetorno=xml`
    try {
      const response = await axios.get(url)
      const parsed = parser.xml2json(response.data, { compact: true })
      const rawJson = JSON.parse(parsed).Servicos.cServico
      let data = Object.keys(rawJson).reduce((acc, current) => {
        acc[`${current}`] = rawJson[current]._text
        return acc
      }, {})
      return res.status(200).send({ ...globalReturn, data })
    } catch (error) {
      console.log(error);
    }
  }
}
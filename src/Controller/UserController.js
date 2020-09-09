const User = require('../Model/User');
const path = require('path');
const fs = require('fs');

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwzl1jzpj',
  api_key: '963981867814849',
  api_secret: 'yB_YlkZONKYx4YH5QV0Rwbwi5ms'
});

const CLOUDINARY_URL = 'cloudinary://963981867814849:yB_YlkZONKYx4YH5QV0Rwbwi5ms@dwzl1jzpj'

const globalResponse = {
  error: 0,
  data: []
}

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}

module.exports = {
  async signUp(req, res) {
    const validFields = ['username', 'email', 'password'];
    const fields = Object.keys(req.body);
    const valid = fields.every((field) => validFields.includes(field));
    if (!valid) {
      return res.status(400).send({ error: 'Invalid Fields !' });
    }
    try {
      const user = await User.create(req.body);
      if (user) {
        const token = await user.generateAuthToken();
        let data = { ...globalResponse, data: { user, token } }
        return res.status(201).send({ data });
      } else {
        return res.status(400).send({ error: 'This email are already in use' });
      }
    } catch (error) {
      return res.status(400).send({ data: { ...globalResponse, error: 1, data: { error: error } } });
    }
  },
  async signIn(req, res) {
    const validFields = ['email', 'password'];
    const fields = Object.keys(req.body);
    const isValidFields = fields.every((field) => validFields.includes(field));
    if (!isValidFields) {
      return res.status(400).send({ error: "Invalid Fields" });
    }
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      console.log(user);
      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }
      const token = await user.generateAuthToken();
      let data = { ...globalResponse, data: { user, token } }
      return res.status(201).send({ data });
    } catch (error) {
      return res.status(400).send({ data: { ...globalResponse, error: 1, data: { error } } });
    }
  },
  async findUser(req, res) {
    const username = req.body.username;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.send({ user: false });
      }
      return res.send({ user: true });
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  async findEmail(req, res) {
    const email = req.body.email;
    console.log(email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.send({ user: false });
      }
      return res.send({ user: true });
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  async getMe(req, res) {
    return res.send({ user: req.user });
  },
  async deleteUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (user) {
        const result = await User.findByIdAndDelete(id);
        if (result) {
          return res.status(200).send({ glov })
        } else { }
      }
      return res.status(201).send({ data: { ...globalResponse, data: 'OK' } });
    } catch (error) {
      return res.status(400).send({ data: { ...globalResponse, error: 1, data: { error } } });
    }
  },
  async uploader(req, res) {
    if (req.file) {
      const { filename: image } = req.file;
      const [name] = image.split('.');
      const hash = hashCode(name);
      cloudinary.uploader.upload(req.file.path, (error, result) => {
        console.log('error', error);
        console.log('result', result);
        if (result) {
          fs.unlinkSync(req.file.path);
          return res.status(200).send({
            ...globalResponse, data: {
              id: result.public_id,
              url: result.url,
              format: result.url,
              created_at: result.created_at,
              width: result.width,
              height: result.height
            }
          });
        } else {
          return res.status(400).send({ ...globalResponse, error: 1, data: { error: 'Unable to upload this file in the moment' } })
        }
      });
    }
  }
}
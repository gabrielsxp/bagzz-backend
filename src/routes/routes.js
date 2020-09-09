const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const UserController = require('../Controller/UserController');
const ProductController = require('../Controller/ProductController');
const multer = require('multer');
const uploadConfig = require('../config/config');
const upload = multer(uploadConfig);

router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.post('/user/upload', upload.single('file'), UserController.uploader);
//router.put('/user', auth, UserController.patchUser);
//router.delete('/user/:id', [upload], UserController.deleteUser)

// Products
router.post('/product', ProductController.create);
router.put('/product/:id', ProductController.change);
router.get('/products', ProductController.index);
router.get('/product/:id', ProductController.getOne);
router.delete('/product/:id', ProductController.remove);
router.delete('/products', ProductController.clear);


module.exports = router;
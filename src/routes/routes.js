const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const UserController = require('../Controller/UserController');
const ProductController = require('../Controller/ProductController');
const CategoryController = require('../Controller/CategoryController');
const StockController = require('../Controller/StockController');
const BannerController = require('../Controller/BannerController');
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
router.get('/products/:category', ProductController.indexByCategory);
router.delete('/product/:id', ProductController.remove);
router.delete('/products', ProductController.clear);
// Categories
router.post('/category', CategoryController.create);
router.put('/category/:id', CategoryController.change);
router.get('/categories', CategoryController.index);
router.get('/category/:id', CategoryController.getOne);
router.delete('/category/:id', CategoryController.remove);
router.delete('/categories', CategoryController.clear);
// Stocks
router.post('/stock', StockController.create);
router.put('/stock/:id', StockController.change);
router.get('/stocks', StockController.index);
router.get('/stock/:id', StockController.getOne);
router.delete('/stock/:id', StockController.remove);
router.delete('/stocks', StockController.clear);
// Banner
router.post('/banner', BannerController.create);
router.put('/banner/:id', BannerController.change);
router.get('/banners', BannerController.index);
router.get('/banner/:id', BannerController.getOne);
router.delete('/banner/:id', BannerController.remove);
router.delete('/banners', BannerController.clear);


module.exports = router;
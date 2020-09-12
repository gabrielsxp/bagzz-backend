const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const UserController = require('../Controller/UserController');
const ProductController = require('../Controller/ProductController');
const CategoryController = require('../Controller/CategoryController');
const StockController = require('../Controller/StockController');
const BannerController = require('../Controller/BannerController');
const ProductSizeController = require('../Controller/ProductSizeController');
const ProductColorController = require('../Controller/ProductColorController');
const AddressController = require('../Controller/AddressController');
const ShoppingChartController = require('../Controller/ShoppingChartController');
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
// Product Size
router.post('/product-size', ProductSizeController.create);
router.put('/product-size/:id', ProductSizeController.change);
router.get('/product-sizes', ProductSizeController.index);
router.get('/product-size/:id', ProductSizeController.getOne);
router.delete('/product-size/:id', ProductSizeController.remove);
router.delete('/product-sizes', ProductSizeController.clear);
// Product Color
router.post('/product-color', ProductColorController.create);
router.put('/product-color/:id', ProductColorController.change);
router.get('/product-colors', ProductColorController.index);
router.get('/product-color/:id', ProductColorController.getOne);
router.delete('/product-color/:id', ProductColorController.remove);
router.delete('/product-colors', ProductColorController.clear);
// Product Color
router.post('/address', auth, AddressController.create);
router.put('/address/:id', auth, AddressController.change);
router.get('/addresses', auth, AddressController.index);
router.get('/address/:id', auth, AddressController.getOne);
router.delete('/address/:id', auth, AddressController.remove);
router.delete('/addresses', auth, AddressController.clear);
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
// Favorites
router.post('/favorites/:id', auth, UserController.addToFavorites)
router.delete('/favorites/:id', auth, UserController.removeFavorite)
router.get('/favorites', auth, UserController.getListOfFavorites)
// Shopping Sharts
router.put('/shopping-chart/:id', auth, ShoppingChartController.change);
router.get('/shopping-chart', auth, ShoppingChartController.index);
module.exports = router;
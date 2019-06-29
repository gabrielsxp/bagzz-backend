const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const UserController = require('../Controller/UserController');
const PostController = require('../Controller/PostController');
const BraintreeController = require('../Controller/BraintreeController');
const TransactionController = require('../Controller/TransactionController');
const multer = require('multer');

const uploadConfig = require('../config/config');
const upload = multer(uploadConfig);

router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.post('/findUser', UserController.findUser);
router.post('/findEmail', UserController.findEmail);
router.post('/subscribe', auth, UserController.subscribe);
router.post('/unsubscribe', auth, UserController.unsubscribe);
router.patch('/account/:user', [auth, upload.single('file')], UserController.updateUserProfile);

router.get('/profile/:user', UserController.getUserProfile);
router.get('/me', auth, UserController.getMe);
router.get('/user/:username', auth, UserController.retrieveUserData);
router.get('/creators', UserController.getCreators);

router.post('/fakeData', UserController.fakeUsers);

router.get('/profile/:user/posts', PostController.userPosts);
router.post('/posts', [auth, upload.single('file')], PostController.store);
router.get('/posts/:postId', auth, PostController.getPost);
router.patch('/user', auth, UserController.patchUser);
router.get('/posts', auth, PostController.index);
router.patch('/posts/:id/like', auth, PostController.likePost);
router.patch('/posts/:id/unlike', auth, PostController.unlikePost);

router.get('/client_token', auth, BraintreeController.generateCustomerToken);
router.post('/purchase/:nonce', auth, BraintreeController.createPaymentMethod);
router.post('/purchase/complete/:nonce', auth, BraintreeController.completePayment);

router.get('/transactions', auth, TransactionController.index);
router.get('/transactions/date', TransactionController.indexByDate);

module.exports = router;
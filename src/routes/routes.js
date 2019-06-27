const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const UserController = require('../Controller/UserController');
const PostController = require('../Controller/PostController');
const BraintreeController = require('../Controller/BraintreeController');

router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.post('/findUser', UserController.findUser);
router.post('/findEmail', UserController.findEmail);
router.post('/subscribe', auth, UserController.subscribe);
router.post('/unsubscribe', auth, UserController.unsubscribe);
router.patch('/account/:user', UserController.updateUserProfile);

router.get('/profile/:user', UserController.getUserProfile);
router.get('/me', auth, UserController.getMe);
router.get('/user/:username', auth, UserController.retrieveUserData);
router.get('/creators', UserController.getCreators);

router.post('/fakeData', UserController.fakeUsers);

router.get('/profile/:user/posts', PostController.userPosts);
router.post('/posts', auth, PostController.store);
router.patch('/user', auth, UserController.patchUser);
router.get('/posts', auth, PostController.index);
router.patch('/posts/:id/like', auth, PostController.likePost);
router.patch('/posts/:id/unlike', auth, PostController.unlikePost);

router.get('/client_token', auth, BraintreeController.generateCustomerToken);
router.post('/purchase/:nonce', auth, BraintreeController.createPaymentMethod);

module.exports = router;
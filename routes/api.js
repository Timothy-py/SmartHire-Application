var express =  require('express');
var router =  express.Router();

// controllers
var userController = require('../controllers/userController');

// POST USER SIGNUP
router.post('/user/signup', userController.postUserCreate);
// POST USER LOGIN
router.post('/user/login', userController.postUserLogin);

module.exports = router;
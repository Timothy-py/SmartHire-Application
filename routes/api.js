var express =  require('express');
var router =  express.Router();
const passport = require('passport');

// controllers
var userController = require('../controllers/userController');

// POST USER SIGNUP
router.post('/user/signup', userController.postUserCreate);

// DASHBOARD
router.get('/', userController.getDashboard);

module.exports = router;


var express =  require('express');
var router =  express.Router();
const passport = require('passport');

// controllers
var userController = require('../controllers/userController');

// POST USER SIGNUP
router.post('/user/signup', userController.postUserCreate);
// POST USER LOGIN
router.post('/user/login', passport.authenticate("local", {
    successMessage: "Logged in successfully",
    failureMessage: "Failed to log in"}), userController.postUserLogin);
// GET LOGOUT
router.get('/user/logout', userController.getUserLogout);
// DASHBOARD
router.get('/', userController.getDashboard);

module.exports = router;


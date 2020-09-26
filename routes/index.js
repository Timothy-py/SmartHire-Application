var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

router.get('/', indexController.getIndex);


module.exports = router;
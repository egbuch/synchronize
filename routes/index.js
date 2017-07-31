var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user.js');
var Freet = require('../model/freet.js')
var validator = require('express-validator');

router.get('/', function(req, res, next){
	res.render('index');
});

module.exports = router;
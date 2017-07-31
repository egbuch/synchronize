var express = require('express');
var session = require('express-session');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user.js');
var Freet = require('../model/freet.js');



router.get('/', function(req, res, next){
	var sessUsername = req.session.username;
	var thisSession = req.session;
	var allFreets = Freet.find({}, function(err, freets){
		res.render('freetTimeline', {freets: freets, yourUser:sessUsername, helpers:{ifNE:function(v1,v2,options){if(v1!==v2){return options.fn(this)}}}});
	});
}); 

router.get('/postfreet', function(req, res, next){
	if (req.session.username === undefined){
		res.redirect('/users/signin');
	}else{
		res.render('postFreet', {user:req.session.username});
	};
});

router.post('/postfreet', function(req, res, next){
	var sessUsername = req.session.username;
	var thisSession = req.session;
	var freetText = req.body.freetText;
	req.checkBody('freetText', 'Freet can be at most 140 characters').isLength({min:1, max: 140});

	var errors = req.validationErrors();

	if (errors) {
	    res.render('postfreet', { errors: errors, user:sessUsername });
	   	return;
	} else {
		Freet.createFreet(freetText, false, sessUsername.toLowerCase(), sessUsername.toLowerCase(), function(err){
			if (err){
				console.log(err);
			};
			var allFreets = Freet.find({}, function(err, freets){
				res.render('freetTimeline', {freets: freets, yourUser:sessUsername, helpers:{ifNE:function(v1,v2,options){if(v1!==v2){return options.fn(this)}}}});
			}); 
		});
	};
});

router.post('/refreet', function(req, res, next){
	var sessUsername = req.session.username;
	var thisSession = req.session;
	var originalAuthor = req.body.originalauthor;
	var freetText = req.body.text;
	Freet.createFreet(freetText, true, sessUsername.toLowerCase(), originalAuthor, function(err){
		if (err){
			console.log(err);
		};
		var allFreets = Freet.find({}, function(err, freets){
			if (err){
				console.log(err)
			};
			res.redirect("/freets")
		}); 
	});
});

router.post('/delete', function(req, res, next){
	var freetID = req.body.freetid;
	console.log(freetID);
	Freet.findById(freetID, function(err, freet){
		if (err){
		    console.log(err)
		};
		Freet.remove(freet, function(){
			res.redirect("/users/myprofile");
		});
	});
});


module.exports = router;
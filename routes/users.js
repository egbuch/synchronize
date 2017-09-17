var express = require('express');
var session = require('express-session');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user.js');
var validator = require('express-validator');
var request = require('request')

var spotauth = require('./spotauth.js')

router.get('/', function(req, res, next){
	res.send('USERS!!');
});

router.get('/registration', function(req, res, next){
	if (req.session.username === undefined){
		res.render('registration');
	}else{
		res.redirect('/spotauth/login');
	}
});

router.post('/registration', function(req, res, next){
	var username = req.body.username;
	var password1 = req.body.password1;
	var password2 = req.body.password2;

	var checkInputs = function(){
		req.checkBody('username', 'Empty username').notEmpty();
		req.checkBody('username', 'Username must only contain letters and/or numbers').isAlphanumeric();
		req.checkBody('username', 'Username must be in between 2-16 characters').isLength({min:2, max: 16});


		req.checkBody('password1', 'Empty password').notEmpty();
		req.checkBody('password1', 'Password must only contain letters and/or numbers').isAlphanumeric();
		req.checkBody('password1', 'Password must be at least 6 characters').isLength({min:6, max: undefined});

		req.checkBody('password2', 'Must confirm password').notEmpty();
		req.checkBody('password2', 'Passwords must match').equals(req.body.password1);
	};

	User.findOne({'username':username.toLowerCase()}, function(err, user){
		if (err){
			console.log(err);
		};

		checkInputs();
		if (user){
			if (username.toLowerCase() === user.username.toLowerCase()){
				req.checkBody(2, 'This username is already taken').equals(23);
			};
		};

		var errors = req.validationErrors();

		if (errors) {
	    	res.render('registration', { errors: errors });
	    	return;
	  	} else {
			var emptyListening = { title: "", artists: [], progressTime: "", isPlaying: false, imageUrl: "" }
			User.createUser(username.toLowerCase(), password1, emptyListening, function(err) {
				if (err){
					console.log(err);
				};
			});
			res.redirect('signin');
	  	};
	});
});


router.get('/signin', function(req, res, next){
	console.log("Entering Sign-in Page")
	if(req.session.username === undefined){
		res.render('signin');
	}else{
		res.redirect('/spotauth/login');
	};
});

router.post('/signin', function(req, res, next){
	console.log("Attempting to sign in ...")
	if (req.session.username === undefined){
		var username = req.body.username;
		var password = req.body.password;

		User.findOne({'username':username.toLowerCase()}, function(err, user){
			console.log("...")
			if (err){
				console.log(err);
			};

			if(user){
				req.checkBody('password', 'Incorrect password for this user').equals(user.password);
			}else{
				req.checkBody(2, 'Username does not belong to any user').equals(23);
			};

			var errors = req.validationErrors();

			if (errors) {
		    	res.render('signin', { errors: errors });
		    	return;
		  	} else {
				console.log("Sign-in successful!")
			    var user_string = encodeURIComponent(username);
				req.session.username = username
				req.session.password = password
				User.update({'username':username.toLowerCase()}, {signedIn:true}, function(err){
					console.log("should be going to spotauth")
					res.redirect('/spotauth/login');
				});
		  	};
		});
	};
});

router.get('/signout', function(req, res, next){
	if(req.session !== undefined){
		var username = req.session.username
		req.session.destroy(function(err){
			if (err){
				console.log(err);
			};

			User.update({'username':req.session.username.toLowerCase()}, {signedIn:false}, function(err){
				res.redirect('/');
			});
		});
	}else{
		res.redirect('/');
	};
});

router.get('/myprofile', function(req, res, next){
	console.log("Going to your profile...");
	if (req.session.username === undefined){
		res.render('signin');
	}else{
		console.log("...");
		if (req.session.currentAccess !== undefined){
			var options = {
	            url: 'https://api.spotify.com/v1/me/player/currently-playing',
	            headers: { 'Authorization': 'Bearer ' + req.session.currentAccess },
	        	json: true
	        };

	        // use the access token to access the Spotify Web API
	        request.get(options, function(error, response, body) {
				var listeningState = {
					title: body.item.name,
					artists: body.item.artists.map(function(artist){
						return artist.name
					}),
					progressTime: body.progress_ms,
					isPlaying: body.is_playing,
					imageUrl: body.item.album.images[0]
				};

				console.log(listeningState);
				User.update({username:req.session.username.toLowerCase()}, {listening:listeningState}, function(err, user){
					res.render('myprofile', {yourUser: req.session.username, user: req.session.username, listening:listeningState});
				})
	        });
		}
	}
});

router.get('/profile/:user', function(req, res, next){
	console.log("----------------------");
	console.log(req.params.user);
	console.log("----------------------");
	if (req.session.username === undefined){
		res.render('signin');
	}else{
		if (req.params.user === req.session.username){
			res.redirect('/users/myprofile');
		}else{
			User.findOne({username:req.session.username.toLowerCase()}, function(err, user){
				res.render('profile', {yourUser: req.session.username, user: req.session.username, listening:user.listening});
			})
		};
	};
});


module.exports = router;

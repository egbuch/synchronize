var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var routes = require('./routes/index.js');
var users = require('./routes/users.js');
var spotauth = require('./routes/spotauth.js')
var cookieParser = require('cookie-parser');
var exphbs  = require('express-handlebars');
var validator = require('express-validator');
var request = require('request');
var User = require('./model/user.js');

//Initiating our app
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sharedsession = require("express-socket.io-session");

// var MONGOLAB_URI =  'mongodb://egbuchp:Ikedi170!@ds063186.mlab.com:63186/heroku_hc7tqg3j'

//Setting the View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'fritterLayout'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

//Session
var session = session({ secret : '12222333334444455555', resave : true, saveUninitialized : true })
app.use(session);

// Io + Sessions Refresh Logic



io.use(sharedsession(session, {autoSave:true}));
io.on("connection", function(socket) {
	console.log("connected!")
	var update_listening = function(timeout) {
		var sess = socket.handshake.session;

		var options = {
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			headers: { 'Authorization': 'Bearer ' + sess.currentAccess },
			json: true
		};

		// use the access token to access the Spotify Web API
		request.get(options, function(error, response, body) {
			if (body !== undefined) {
				var listeningState = {
					title: body.item.name,
					artists: body.item.artists.map(function(artist){
						return artist.name
					}),
					progressTime: body.progress_ms,
					isPlaying: body.is_playing,
					imageUrl: body.item.album.images[0]
				};

				User.update({username:sess.username.toLowerCase()}, {listening:listeningState}, function(err){
					socket.emit("update-listening", listeningState);

					setTimeout(function() { update_listening(timeout) }, timeout);
				});
			}
		});
	};

	update_listening(3000);

});

//Serving static files!!
app.use(express.static(path.join(__dirname, 'public')));

//Setting the routes
app.use('/', routes);
app.use('/users', users);
app.use('/spotauth', spotauth.router);

var port = process.env.PORT || 3000;

//Connecting to MongoDB
mongoose.connect('mongodb://localhost/fritter_db');

//Have app listen at localhost:3000
server.listen(3000);

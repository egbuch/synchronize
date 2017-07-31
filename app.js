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

//Initiating our app
var app = express();

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
app.use(session({ secret : '6170', resave : true, saveUninitialized : true }));

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
app.listen(port, function () {
	console.log('Fritter listening...');
});

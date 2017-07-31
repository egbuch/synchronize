var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	signedIn: Boolean,
	listening: String
});

userSchema.statics.createUser = function(name, pass, callback){
	var newUser = UserModel({
		username: name,
		password: pass,
		signedIn: false,
		listening: ""
	});
	newUser.save(callback);
};

//Username must be in between 2-16 characters and all alphanumeric characters
userSchema.path('username').validate(function(value) {
    return ((/^[a-z0-9]+$/i.test(value)) && (value.length >= 2) && (value.length <= 16));
}, 'Invalid Username!');

//Password must be at least 6 characters and all alphanumeric characters
userSchema.path('password').validate(function(value) {
    return ((/^[a-z0-9]+$/i.test(value)) && (value.length >= 6));
}, 'Invalid Password!');

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

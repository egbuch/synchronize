var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var freetSchema = mongoose.Schema({
	text: String,
	isRefreet: Boolean,
	author: String,
	originalAuthor: String,
	timeStamp: String
});

freetSchema.statics.createFreet = function(freetText, isrefreet, username, originalUsername, callback){
	var timeStamp = new Date();
	var newFreet = FreetModel({
		text: freetText,
		isRefreet: isrefreet,
		author: username,
		originalAuthor: originalUsername,
		timeStamp: (timeStamp.getMonth() + 1).toString() + '/' + timeStamp.getDate().toString() + '/' + timeStamp.getFullYear().toString() + " " + timeStamp.getHours().toString() + ':' + ('0'+timeStamp.getMinutes().toString()).slice(-2) + ':' + ('0'+timeStamp.getSeconds().toString()).slice(-2)
		});
		newFreet.save(callback);
};

//Freet must be in between 1 and 140 characters
freetSchema.path('text').validate(function(value) {
    return ((value.length >= 1) && (value.length <= 140));
}, 'Freet is of an invalid length!');

var FreetModel = mongoose.model('Freet', freetSchema);
module.exports = FreetModel;
var mongoose = require('mongoose');

module.exports = mongoose.model('Song', {
	songname: String,
	artist: String,
	bpm: String,
	url: String,
	loop: String,
	beginoffset: Number,
	startsong1: Number,
	endsongshort: Number,
	endsongafterbeat: Number,
	language: String,
	genre: String,
	mood: String
});


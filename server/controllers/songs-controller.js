var Song = require('../models/songs')

module.exports.list = function(req, res){
	Song.find({}, function(err, results){
		res.json(results);
	});
}


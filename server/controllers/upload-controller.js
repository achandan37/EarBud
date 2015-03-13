var Upload= require('../models/songs')

module.exports.create = function (req, res){
	if(done===true){
		console.log(req.files);
		sess=req.session;
		// res.end("File uploaded.");
			
			console.log(req.files.userSong.path)
		var upload = new Upload({url: req.files.userSong.path});
			upload.save(function(err,result){
				
			res.writeHead(302, {
  			'Location': '/uploadedsong'
  			//add other headers here...
			});
			res.end();
		});
	}
	
}

module.exports.update = function(req,res){
	// var upload = new Upload(req.body);
	console.log(req.body);
	var urlvar=req.body.url
	Upload.update({url: urlvar},req.body,function(err, results){
		res.json(results);
	});
}


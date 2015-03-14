var express 			= require('express'),
	multer				= require('multer');
var	session				= require('express-session');
	app 				= express(),
	mongoose			= require('mongoose'),
	songsController 	= require('./server/controllers/songs-controller'),
	uploadController	= require('./server/controllers/upload-controller'),
	bodyParser 			= require('body-parser'),
	done				= false


mongoose.connect('mongodb://localhost:27017/songs');


app.use(session({secret:'ssshhhhh'}));
var sess;

app.use(multer({dest:'./assets/musicmix/',
rename: function (fieldname, filename){
	console.log(filename);
	return filename;
},

onFileUploadStart: function(file) {
	// console.log(file.originalname+ ' is starting ...')
},

onFileUploadComplete: function(file) {
	// console.log(file.fieldname + 'uploaded to ' +file.path)
	done=true;
}

}));


app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.get('/', function(req,res){
	res.sendFile(__dirname+'/client/views/songstemp.html');
});

app.get('/songupload', function(req,res){
	res.sendFile(__dirname+'/client/views/songupload.html');
});

app.get('/songmapper', function(req,res){
	res.sendFile(__dirname+'/client/views/songmapper.html');
});

app.get('/uploadedsong', function(req,res){
	res.sendFile(__dirname+'/client/views/uploadedsong.html');
});

app.post('/api/songupload', uploadController.create);
app.post('/api/uploadedsong', uploadController.update);


app.use('/js', express.static(__dirname + '/client/js'));
app.use('/images', express.static(__dirname + '/assets/images'));

app.use('/css', express.static(__dirname + '/assets/css'));
app.use('/song', express.static(__dirname + '/assets/musicmix'));

app.use('/fonts', express.static(__dirname + '/assets/fonts'));
app.use('/assets', express.static(__dirname + '/assets'));


app.get('/api/songs', songsController.list);

app.listen(8000, function(){
	console.log("listening to port");
})
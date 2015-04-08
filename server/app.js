/* global require, process, __dirname */

var express         = require('express');
var http            = require('http');
var path            = require('path');
var favicon 				= require('serve-favicon');
var logger 					= require('morgan');
var cookieParser 		= require('cookie-parser');
var bodyParser 			= require('body-parser');
var session         = require('express-session');


var compiler        = require('./routes/API/views.js');

var mongo 					= require('mongodb');
var monk 						= require('monk');
var db 							= monk('localhost:27017/educationApp');

process.env.TMPDIR  = __dirname + '/uploads';


var app = express();

// all environments
app.set('port',  3000);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/images/favicon.ico'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser('conference'));
app.use(session({
        secret              : 'sciencememo session secret',
        name                : 'session',
        resave              : true,
        saveUninitialized   : true
}));
app.use(express.static(path.join(__dirname, './public')));
app.use(logger("dev"));

// Make our db accessible to our router

app.use(function(req,res,next){
    req.db = db;
    next();
});


require("./routes/routes.js")(app); //routes definitions

// development only
if("development" == app.get('env'))
{
  //  app.use(errorHandler());
}


//Create Express Servre
http.createServer(app).listen(app.get('port'), function ()
{
    console.log('Express server listening on port ' + app.get('port'));
    console.log('===========================================');

    compiler.compileViews(); //compile views



});











app.get('/test', function(req,res){
	console.log("ola")
		var collection = req.db.get("test");

		collection.insert({ name: 'Ana', bigdata: {} });

		collection.find({},{},function(e,docs){
        console.log(docs);
    });

});

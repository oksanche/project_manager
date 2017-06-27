var fs = require('fs'); 
var express = require('express'); 
var app = express(); 

var bodyParser = require('body-parser');
app.use(bodyParser.json() );   

var urlencodedParser = bodyParser.urlencoded({ extended: false }) 

app.use(express.static('public'));
app.use('/css', express.static('css'));

var mysql = require('mysql');
var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'panfilov',
	  database : 'projectmanager'
	});

app.get('/index.html', function (req, res) {   
   res.sendFile( __dirname + "/" +"index.html" ); 
}) 


app.post('/index.html',urlencodedParser, function (req, res, next) { 
	
}) 

var server = app.listen(8080, function () { 
var host = server.address().address 
var port = server.address().port 

console.log("ProjectManager app listening at http://%s:%s", host, port) 
})

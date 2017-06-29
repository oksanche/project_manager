//Автор: Оксана Панфилова.

// Зависимости
var mysql = require('mysql');

//Параметры подключения к базе данных
var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'root',
				  password : 'panfilov',
				  database : 'projectmanager'
});

 connection.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected to database!");
 }) 
 
module.exports =  connection;
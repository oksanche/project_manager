var express = require('express'); 
var app = express(); 

app.use(express.static('public'));
app.use('/css', express.static('css'));

app.use('/view', express.static('css'));

var bodyParser = require('body-parser');

app.use( bodyParser.json() );  

var urlencodedParser = bodyParser.urlencoded({ extended: false }) 

var mysql = require('mysql');

var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'root',
				  password : 'panfilov',
				  database : 'projectmanager'
				});
 connection.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
 }) 
 
app.get('/login', function (req, res) {   
   res.sendFile( __dirname + "/" +"index.html" ); 
}) 

//Запрос			
app.get('/registration', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"registration.html" ); 
}) 

 
//Запрос на регистрацию пользователя
app.post('/registration', urlencodedParser, function (req, res) {   

var email=req.body.email;
var password=req.body.password;
var firstname=req.body.firstname;
var lastname=req.body.lastname;
var error={
	message:""
};
// Найдем пользователя чей find email совпадает с email формы	
       connection.query("select * from tbluser where varchUserEmail = '"+email+"'", function(err,rows){

		// Произошли любые другие ошибки
			 if (err)	
				 console.log(err);				
                 error.message=err;
				 res.send(JSON.stringify(error,"", 3));
		//Ошибка: если результат select-запроса не пуст: пользователь уже существует		
			 
			 if (rows.length) {		
                 console.log("ЗАНЯТО");
				 error.message="Такой email уже занят. Попробуйте снова";
				 res.send(JSON.stringify(error,"", 3));
            } else {
								
				var insertQuery = "INSERT INTO tbluser ( varchUserEmail,varchUserFirstName,varchUserLastName, varchUserPassword ) values ('" + email +"','"+ firstname +"','"+ lastname +"','"+ password +"')";					
				
				connection.query(insertQuery, function(err,rows){
				
				if (err){
				console.log(err);
				}
			
				 res.redirect("/login");
				});
			}
});
})
app.post('/login', urlencodedParser,function (req, res) {   
			var email=req.body.email;
			var password=req.body.password;
			
			var error={
				code:0,
				message:""
			};
			
         connection.query("SELECT * FROM `tbluser` WHERE `varchUserEmail` = '" + email + "'", function(err,rows){
			if (err){
				error.code=-1;
				error.message=err;
				console.log(err);
			}
               
			 if (!rows.length) { 
			    error.code=-1;
				error.message="Нет такого пользователя";
				res.status(500);
			
             console.log('нет такого пользователя');
			 //message
			} 
				
             // если пользователь найден, но пароль неверен
            if (!( rows[0].varchUserPassword == password)){
				error.code=-1;
				
			  	res.redirect("/login");
				
				//error.message="Неверный пароль";	

			//	res.send(JSON.stringify(error,"", 3));
             //  console.log("НЕВЕРНЫЙ ПАРОЛЬ");
			}
			else {
            res.sendFile( __dirname + "/view/" +"mainpage.html" ); 
			}
            // Все хорошо, возвращаем успешного пользователя
           // return done(null, rows[0]);			
		
		});
	})

app.get('/', function (req, res) {
    res.redirect('/login');
});

app.get('/index.html', function (req, res) {
    res.redirect('/login');
});
app.get('*', function(req, res){
   res.status(404).send('Cтраница не найдена! Возможно, запрашиваемая Вами страница была перенесена или удалена. Или Вы допустили небольшую опечатку при вводе адреса, поэтому еще раз внимательно проверьте.');
});

//Информация о сервере
var server = app.listen(8080, function () { 
var host = server.address().address 
var port = server.address().port 

console.log("ProjectManager app listening at http://%s:%s", host, port) 
})
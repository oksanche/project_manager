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

//Запрос			
app.get('/mainpage', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"mainpage.html" ); 
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
				 res.send(JSON.stringify(error,"", 3));
				 res.redirect("/login");
				});
			}
});
})
app.post('/login', urlencodedParser,function (req, res) {   
			var email=req.body.email;
			var password=req.body.password;

         connection.query("SELECT * FROM `tbluser` WHERE `varchUserEmail` = '" + email + "'", function(err,rows){
			if (err){
				console.log(err);
			}
               
			 if (!rows.length) {               
             console.log(rows[0]);
			} 
				
             // если пользователь найден, но пароль неверен
            if (!( rows[0].varchUserPassword == password)){
				 console.log(rows[0].password );
               console.log("НЕВЕРНЫЙ ПАРОЛЬ");
			}
			var path = __dirname +"/mainpage";
             res.redirect(path);
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
var express = require('express'); 
var app = express(); 

app.use(express.static('public'));
app.use('/css', express.static('css'));
app.use('/view', express.static('css'));

var bodyParser = require('body-parser');
app.use( bodyParser.json() );


var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
//куки парсер
var cookieParser = require('cookie-parser');
app.use(cookieParser());

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
 
 // app.use(express.session({
	 // secret:'1';
	 // store:
 
app.get('/login', function (req, res) {   

if (req.cookies.user === undefined) {
        res.cookie('user', '0');
        console.log('setting cookie to false');
		res.sendFile( __dirname + "/" +"index.html" );
    }

    if (req.cookies.user === '1') {
        res.redirect('/mainpage');
        return;
    } 
	else {
		 res.sendFile( __dirname + "/" +"index.html" );
	}
}) 
app.get('/mainpage', function (req, res) {  

 if (req.cookies.user === undefined) {
        res.cookie('user', '0');
        console.log('setting cookie to false');		
    }
	
    if (req.cookies.user === '1') {
        res.sendFile( __dirname + "/view/" +"mainpage.html"); 
        return;
    } 
	else {
		res.redirect('/login');
	}
 
}) 
//Запрос			
app.get('/registration', function (req, res) {   
    if (req.cookies.user === '1') {
        res.redirect("/mainpage");
        return;
    } 
	else {
		res.sendFile( __dirname + "/view/" +"registration.html"); 
	}
}) 

 app.get('/statistics.html', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"statistics.html" ); 
}) 

 app.get('/new_project.html', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"new_project.html" ); 
}) 

 app.post('/new_project.html', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"new_project.html" ); 
}) 

 app.get('/tasks.html', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"tasks.html" ); 
}) 
 app.get('/administration.html', function (req, res) {   
   res.sendFile( __dirname + "/view/" +"administration.html" ); 
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
                 console.log("Такой email уже занят. Попробуйте снова");
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
app.post('/mainpage', urlencodedParser, function (req, res) {   
				 
				 
			var email=req.body.email;
			var password=req.body.password;
		
         connection.query("SELECT * FROM `tbluser` WHERE `varchUserEmail` = '" + email + "'", function(err,rows){
			 
			if (err){
				res.redirect("/login");	
				console.log(err);
			}
               
			 if (!rows.length) { 
				res.redirect("/login");	
                console.log('Нет такого пользователя');
			 //message
			} 
				
             // если пользователь найден, но пароль неверен
            if (!( rows[0].varchUserPassword == password)){
				 console.log("Неверный пароль");
		         res.redirect("/login");	
			}
			else {
				// req.session.email = request.body.email;
				// res.cookie('id', rows[0].varchUserId);
				 res.cookie('user', '1');
				 res.redirect("/mainpage");
				 }
		});
	})

app.get('/', function (req, res) {
	
	console.log('Мы в /');
    console.log(req.cookies.user);
    console.log(req.cookies.user === '0');
    console.log('конец');
	
	//если куков не было ваще никаких
    if (req.cookies.user === undefined) {
        res.cookie('user', '0');
        console.log('setting cookie to false');
    }

    if (req.cookies.user === '1') {
         res.redirect('/mainpage');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function (req, res) {
	 res.cookie('user', undefined);
	 console.log(req.cookies.user);
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
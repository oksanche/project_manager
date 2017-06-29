// Автор: Оксана Панфилова
// Зависимости
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('public'));
app.use('/css', express.static('css'));
app.use('/modules', express.static('modules'));


// Модуль, устанавливающий соединение с БД 
var db = require('./modules/db');
// Модуль регистрации пользователя в системе
var registrate = require('./modules/registration');
// Модуль авторизации пользователя в системе
var login = require('./modules/login');
// Модуль ля созания нвого проекта
var newproject = require('./modules/newproject');

var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("ProjectManager app listening at http://%s:%s", host, port)
})

app.get('/login', function(req, res) {

    if (req.cookies.user === undefined) {
        res.cookie('user', '0');
        console.log('setting cookie to false');
        res.sendFile(__dirname + "/" + "index.html");
    }

    if (req.cookies.user === '1') {
        res.redirect('/mainpage');
        return;
    } else {
        res.sendFile(__dirname + "/" + "index.html");
    }
})



app.get('/statistics.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "statistics.html");
})

app.get('/tasks.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "tasks.html");
})
app.get('/administration.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "administration.html");
})

/*==================== РЕГИСТРАЦИЯ ==================================*/

//  Переход на страницу "Регистрация"			
app.get('/registration', function(req, res) {
//  Запрещаем авторизированному пользователю перейти на страницу регистрации
    if (req.cookies.user === '1') {
		// На главную страницу
        res.redirect("/mainpage");
        return;
    } else {
        res.sendFile(__dirname + "/view/" + "registration.html");
    }	
})

//Запрос на регистрацию пользователя
app.post('/registration', urlencodedParser, function(req, res) {
   registrate(db,req,res); 
})
/*==================== ГЛАВНАЯ СТРАНИЦА =============================*/
// Переход на главную страницу
app.get('/mainpage', function(req, res) {

    if (req.cookies.user === undefined) {
        res.cookie('user', '0');
        console.log('setting cookie to false');
    }
    //Если пользователь авторизован, переходим на главную
    if (req.cookies.user === '1') {
        res.sendFile(__dirname + "/view/" + "mainpage.html");
        return;
    } else {
		//Иначе
        res.redirect('/login');
    }
})

//Запрос на авторизацию и на переход на главную страницу
app.post('/mainpage', urlencodedParser, function(req, res) {
    login(db,req,res);   
})

/*========= ГЛАВНАЯ СТРАНИЦА С СОДЕРЖИМЫМ "Cоздать проект" ===========*/ 

// Подгружаем в основной блок главной страницы содержимое 
app.get('/new_project.html', function(req, res) { 
res.sendFile(__dirname + "/view/" + "new_project.html"); 
}) 
// Обрабатываем запрос на создание проекта 
app.post('/mainpage/newproject', urlencodedParser, function(req, res) { 
newproject(db, req, res); 
})

/*==================== ВЫЙТИ =============================*/
app.get('/logout', function(req, res) {
    // Очищаем куки.
    res.cookie('userid', undefined);
    res.cookie('user', undefined);
    // Перенаправляем на страницу авторизации пользователя
    res.redirect('/login');
});

/*=======================================================*/
app.get('/', function(req, res) {

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
/*===================== 404 ==============================*/
app.get('*', function(req, res) {
	// Посылаем страницу с информацией об ошибке
    res.status(404).sendFile(__dirname + "/view/" + "404.html");
});



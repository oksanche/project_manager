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

// Модуль, устанавливающий соединение с БД 
var db = require('./modules/db');
var registrate = require('./modules/registration');
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
app.get('/mainpage', function(req, res) {

    if (req.cookies.user === undefined) {
        res.cookie('user', '0');
        console.log('setting cookie to false');
    }

    if (req.cookies.user === '1') {
        res.sendFile(__dirname + "/view/" + "mainpage.html");
        return;
    } else {
        res.redirect('/login');
    }

})
//Запрос			
app.get('/registration', function(req, res) {
//  Запрещаем авторизированному пользователю перейти на страницу регистрации
    if (req.cookies.user === '1') {
        res.redirect("/mainpage");
        return;
    } else {
        res.sendFile(__dirname + "/view/" + "registration.html");
    }
	
})

app.get('/statistics.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "statistics.html");
})


app.get('/new_project.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "new_project.html");
})

app.post('/mainpage/newproject', function(req, res) {
    var id = parseInt(req.cookies.userid);
    var name = req.body.projectname;
    var insertQuery = "INSERT INTO tblproject ( varchProjectName, bigintUserId ) values ('" + name + "','" + id + "')";

    db.query(insertQuery, function(err, rows) {
        if (err) {
            console.log(err);
        }
    });
})

app.get('/tasks.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "tasks.html");
})
app.get('/administration.html', function(req, res) {
    res.sendFile(__dirname + "/view/" + "administration.html");
})

//Запрос на регистрацию пользователя
app.post('/registration', urlencodedParser, function(req, res) {
   registrate(db,req);
})
app.post('/mainpage', urlencodedParser, function(req, res) {


    var email = req.body.email;
    var password = req.body.password;

    db.query("SELECT * FROM `tbluser` WHERE `varchUserEmail` = '" + email + "'", function(err, rows) {

        if (err) {
            res.redirect("/login");
			console.log(err);
        }

        if (!rows.length) {
            res.redirect("/login");
            console.log('Нет такого пользователя');
            //message
        }

        // если пользователь найден, но пароль неверен
        if (!(rows[0].varchUserPassword == password)) {
            console.log("Неверный пароль");
            res.cookie('user', '0');
            res.redirect("/login");
        } else {
            res.cookie('userid', rows[0].bigintUserId);
            res.cookie('username', rows[0].varchUserFirstName + " " + rows[0].varchUserFirstName);
            res.cookie('user', '1');
            res.redirect("/mainpage");
        }
    });
})

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

// Выход из системы
app.get('/logout', function(req, res) {
    // Очищаем куки.
    res.cookie('userid', undefined);
    res.cookie('user', undefined);
    // Перенаправляем на страницу авторизации пользователя
    res.redirect('/login');
});

//Обращаемся по адресу, которого нет на сервере
app.get('*', function(req, res) {
	// Посылаем страницу с информацией об ошибке
    res.status(404).sendFile(__dirname + "/view/" + "404.html");
});


var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("ProjectManager app listening at http://%s:%s", host, port)
})
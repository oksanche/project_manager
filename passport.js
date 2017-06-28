// Модули

var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');

var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'root',
				  password : 'panfilov',
				  database : 'projectmanager'
				});

module.exports = function(passport) {

    // Установка сессии 

	// Каждый последующИй запрос будет содержать cookies, 
	// с помощью которого passport сможет опознать пользователя, и достать его данные из сессии. 
	// Для того, чтобы сохранять или доставать пользовательские данные из сессии, паспорт использует:
    // Используется для сериализации пользователя для сессии
   
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    // Используется для десериализации пользователя для сессии
    passport.deserializeUser(function(id, done) {
		connection.query("select * from tbluser where bigintUserId = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });
	


    // РЕГИСТРАЦИЯ 
    // Используются именованные стратегии, так как у нас есть один для входа и один для регистрации
    // по умолчанию, если имени не было, оно просто называется «local»

    passport.use('local-registration', new LocalStrategy({
       // По-умолчанию, если в LocalStrategy не передавать никаких опций — 
	   // стратегия будет искать параметры для авторизации пользователя в формах с именами `username` и `password`. 
	   // Переопреелим их, дав названия своиз форм из файла index.html
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // Разрешает вернуть весь запрос при вызове
    },
	
	// Второй аргумент — middleware — принимает параметры `username` - переопреелено на email, 
	//`passport` и `done`. 
    function(req, email, password, done) {

		// Найдем пользователя чей find email совпадает с email формы	
        connection.query("select * from tbluser where varchUserEmail = '"+email+"'", function(err,rows){
			//Найденный объект
			console.log(rows);
		// Произошли любые другие ошибки
			if (err)
				
                return done(err);
		//Ошибка: если результат select-запроса не пуст: пользователь уже существует		
			 if (rows.length) {
				// В done передаем объект пользователя, если такой есть.
// Передаем flash-сообщение: после того, как сообщение показано, оно удаляется. Категория сообщения 				
                return done(null, false, req.flash('registrationMessage', 'Электронная почта уже занята.'));
            } else {
				
                // если нет пользователя с этим адресом электронной почты
                // создать пользователя
                var newUserMysql = new Object();
				
				newUser.email    = email;
                newUser.password = password; // Используйте функцию !!!generateHash !!!! в нашей пользовательской модели
			
				var insertQuery = "INSERT INTO tbluser ( varchUserEmail, varchUserPassword ) values ('" + email +"','"+ password +"')";
					console.log(insertQuery);
					
				connection.query(insertQuery, function(err,rows){
				newUser.id = rows.insertId; //??????????????????7
				// в done записываем нового пользователя
				return done(null, newUser);
				});	
            }	
		});
    }));

    // АВТОРИЗАЦИЯ 
   // мы используем именованные стратегии, так как у нас есть одна для входа и одна для регистрации
    // по умолчанию, если имя не было, оно просто называется «local»

	
    passport.use('local-login', new LocalStrategy({
       
      // переопределяем имена формы аналогично (строка)
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { // обратная функция с электронной почтой и паролем из нашей формы

         connection.query("SELECT * FROM `tbluser` WHERE `varchUserEmail` = '" + email + "'",function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'Пользователь не найден.')); // req.flash - это способ установить flashdata с помощью connect-flash
            } 
			
			
             // если пользователь найден, но пароль неверен
            if (!( rows[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Неверный пароль.')); 
                // создаем loginMessage и сохраняем его в сессии как flashdata
			console.log(rows[0]);
            // Все хорошо, возвращаем успешного пользователя
            return done(null, rows[0]);			
		
		});
		
		
    }));

};
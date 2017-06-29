 // Автор: Оксана Панфилова
 
 module.exports= function (db, req) {
 // Данные для регистрации
    var email = req.body.email;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    // Найдем пользователя чей email совпадает с email формы	
    db.query("select * from tbluser where varchUserEmail = '" + email + "'", function(err, rows) {

        if (err)
        console.log(err);
	
        //Если результат select-запроса не пуст (пользователь уже существует) ,сигнализируем об ошибке,		
        if (rows.length) {
            console.log("Такой email уже занят. Попробуйте снова");
        } else {
		//иначе сохраняем пользователя в БД
            var insertQuery = "INSERT INTO tbluser ( varchUserEmail,varchUserFirstName,varchUserLastName, varchUserPassword ) values ('" + email + "','" + firstname + "','" + lastname + "','" + password + "')";

            db.query(insertQuery, function(err, rows) {
                if (err) {
                    console.log(err);
                }
		//Если все хорошо, то перенаправляем на страницу для авторизации		
                res.redirect("/login");
            });
        }
    });
};
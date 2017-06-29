//Автор: Панфилова Оксана

 module.exports= function (db, req, res) {
    var email = req.body.email;
    var password = req.body.password;

    db.query("SELECT * FROM `tbluser` WHERE `varchUserEmail` = '" + email + "'", function(err, rows) {

        if (err) {
			console.log(err);
			res.cookie('user', '0');
            res.redirect("/login");
           
        }

        if (!rows.length) {
            //res.redirect("/login");
            console.log('Нет такого пользователя');
			res.cookie('user', '0');
            res.redirect("/login");
            //message
        }

        // если пользователь найден, но пароль неверен
        else {
			if (!(rows[0].varchUserPassword == password)) {
            console.log("Неверный пароль");
            res.cookie('user', '0');
            res.redirect("/login");
        } else {
            res.cookie('userid', rows[0].bigintUserId);
            res.cookie('username', rows[0].varchUserFirstName + " " + rows[0].varchUserLastName);
            res.cookie('user', '1');
            res.redirect("/mainpage");
			}
		}
    });
};
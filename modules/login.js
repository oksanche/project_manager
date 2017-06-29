//Автор: Панфилова Оксана

 module.exports= function (db, req) {
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
};
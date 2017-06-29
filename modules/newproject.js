// Автор: Оксана Панфилова

module.exports = function (db, req, res) {
   //Т.к. куки в строке делаем число: в БД хранится в виде числа
    var id = parseInt(req.cookies.userid);
    var projectname = req.body.projectname;
	
    var insertQuery = "INSERT INTO tblproject ( varchProjectName, bigintUserId ) values ('" + projectname + "','" + id + "')";

    db.query(insertQuery, function(err, rows) {
        if (err) {
            console.log(err);
        }
	res.redirect('/mainpage');
    });
};
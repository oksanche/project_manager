// Автор: Оксана Панфилова
module.exports = function (db, req, res){
    var id = parseInt(req.cookies.userid);
	
    var insertQuery = "SELECT varchProjectName from tblproject WHERE bigintUserId=" + id + "";
console.log(insertQuery);

    db.query(insertQuery, function(err, rows) {
        if (err) {
            console.log(err);
			//res.send("");
        }
		var records = {rows};
		res.send(JSON.stringify(records));
	});
};
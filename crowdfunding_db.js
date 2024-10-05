var dbDetails = require("./db-details");//get information about the database

var mysql = require('mysql2');
var bodyParser = require('body-parser');
var http = require('http');

// Create a connection with MySQL database
module.exports = {
	getconnection: ()=>{
	return mysql.createConnection({
		host:dbDetails.host,
		user:dbDetails.user,
		password:dbDetails.password,
		database:dbDetails.database	
	});
}
}


var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var mysql = require('mysql')
var bodyParser = require('body-parser');

//Password Encryption
var bcrypt = require('bcrypt');

//JWT TOKEN
var jwt = require('jsonwebtoken');
app.set('jwtKey', "ssss"); // secret variable

//REST CLIENT FOR MAPS API
var Client = require('node-rest-client').Client;
var client = new Client();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (req, res, next) {
    global.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'asdf',
        database: 'travlender',
        multipleStatements: true
    });
    next();
});

// routes ======================================================================
require('./routes/users.js')(app, bcrypt, jwt);
require('./routes/maps.js')(app,client);
require('./routes/events.js')(app);

//Start Server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

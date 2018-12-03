var verifyToken = require('./verifytoken');

module.exports = function (app, bcrypt, jwt) {
    //User Registration
    app.post('/api/user/register', function (req, res) {
        //Read inputs from body of rest call
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        var mobno = req.body.mobno;

        //check input values
        if (username == null || username == undefined || username == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User Name' });
        }
        if (password == null || password == undefined || password == "") {
            return res.status(400).json({ status: 'error', errorcode: 102, errormsg: 'Invalid Password' });
        }
        if (name == null || name == undefined || name == "") {
            return res.status(400).json({ status: 'error', errorcode: 103, errormsg: 'Invalid Name' });
        }
        if (email == null || email == undefined || email == "") {
            return res.status(400).json({ status: 'error', errorcode: 104, errormsg: 'Invalid Email' });
        }
        if (mobno == null || mobno == undefined || mobno == "") {
            return res.status(400).json({ status: 'error', errorcode: 105, errormsg: 'Invalid Mobile No' });
        }

        //encrypt password
        let hashPassword = bcrypt.hashSync(password, 10);

        //SQL Query to Insert event
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection Error' });
            } else {
                var sql_user = "INSERT INTO USERS values(default,'" + username + "','" + hashPassword + "','" + name + "','" + email + "','" + mobno + "')"
                connection.query(sql_user, function (err, results, rows, fields) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        //console.log(results);
                        var userId = results.insertId;
                        var sql_tpref = "INSERT INTO TRANSIT_PREF values("+results.insertId+",'1','1','1','1','1')";
                        connection.query(sql_tpref, function (err, results_tpre, rows, fields) {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                            } else {
                                return res.status(200).json({ status: 'success', userId:userId});
                            }
                        });
                        
                    }
                    //release connection
                    connection.end();
                })
            }
        });

    });

    //User Login
    app.post('/api/user/auth', function (req, res) {
        //Read inputs from body of rest call
        var username = req.body.username;
        var password = req.body.password;

        //check input values
        if (username == null || username == undefined || username == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User Name' });
        }
        if (password == null || password == undefined || password == "") {
            return res.status(400).json({ status: 'error', errorcode: 102, errormsg: 'Invalid Password' });
        }

        //SQL Query to SELECT 
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection' });
            } else {
                var sql_user = "SELECT * FROM USERS where userName= '" + username + "'"
                connection.query(sql_user, function (err, results, fields) {
                    if (err) {
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        if (results.length == 1) {
                            if (bcrypt.compareSync(password, results[0].password)) {
                                console.log(results[0]);
                                // Passwords match
                                const payload = {
                                    userid: results[0].userId,
                                    username: results[0].username,
                                    password: results[0].password,
                                    name: results[0].name,
                                    email: results[0].email,
                                    mobno: results[0].mobno
                                };
                                var token = jwt.sign(payload, app.get('jwtKey'));
                                return res.status(200).json({ status: 'success', isValidUser: true, token: token });
                            } else {
                                // Passwords don't match
                                return res.status(200).json({ status: 'success', isValidUser: false, errorcode: 111, errormsg: "Wrong Password" });
                            }

                        } else {
                            return res.status(200).json({ status: 'success', isValidUser: false, errorcode: 111, errormsg: "User Not Exits" });
                        }
                    }
                })
                //release connection
            }
            connection.end();
        });
    });

    //User Update
    app.post('/api/user/update', verifyToken, function (req, res) {
        //read from decoded token
        var userId = req.decoded.userid;
        //Read inputs from body of rest call
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        var mobno = req.body.mobno;

        //check input values
        if (userId == null || userId == undefined || userId == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User Name' });
        }
        // if (password == null || password == undefined || password == "") {
        //     return res.status(400).json({ status: 'error', errorcode: 102, errormsg: 'Invalid Password' });
        // }
        if (name == null || name == undefined || name == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid Name' });
        }
        if (email == null || email == undefined || email == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid Email' });
        }
        if (mobno == null || mobno == undefined || mobno == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid Mobile No' });
        }

        //SQL Query to Insert event
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection Error' });
            } else {
                //check password filed
                if (password == null || password == undefined || password == "") {
                    var sql_user = "UPDATE USERS SET NAME= '" + name + "', EMAIL='" + email + "', MOBNO='" + mobno + "' WHERE USERID="+userId
                } else {
                    //encrypt password
                    let hashPassword = bcrypt.hashSync(password, 10);
                    var sql_user = "UPDATE USERS SET NAME= '" + name + "', PASSWORD= '" + hashPassword + "', EMAIL='" + email + "', MOBNO='" + mobno + "' WHERE USERID="+userId
                }

                connection.query(sql_user, function (err, results, rows, fields) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        return res.status(200).json({ status: 'success' });
                    }
                    //release connection
                    connection.end();
                })
            }
        });

    });
    //User Registration
    app.post('/api/user/timepass', function (req, res) {
        //Read inputs from body of rest call
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        var mobno = req.body.mobno;

        //check input values
        if (username == null || username == undefined || username == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User Name' });
        }
        if (password == null || password == undefined || password == "") {
            return res.status(400).json({ status: 'error', errorcode: 102, errormsg: 'Invalid Password' });
        }
        if (name == null || name == undefined || name == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid Name' });
        }
        if (email == null || email == undefined || email == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid Email' });
        }
        if (mobno == null || mobno == undefined || mobno == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid Mobile No' });
        }


        //encrypt password
        let hashPassword = bcrypt.hashSync(password, 10);

        //SQL Query to Insert event
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection Error' });
            } else {
                var sql_user = "INSERT INTO USERS values(default,'" + username + "','" + hashPassword + "','" + name + "','" + email + "','" + mobno + "')"
                connection.query(sql_user, function (err, results, rows, fields) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        return res.status(200).json({ status: 'success' });
                    }
                    //release connection
                    connection.end();
                })
            }
        });

    });  

     //get all prefer
     app.get('/api/user/transpref', verifyToken, function (req, res) {
        //console.log(req.decoded);
        var sql = "SELECT * FROM TRANSIT_PREF WHERE USERID=" + req.decoded.userid;
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                res.json({ result: 'error' });
            } else {
                res.json({ result: 'success', data: rows });
            }
        })
        connection.end();
    })

    //get all prefer
    app.get('/api/user/update/transpref', verifyToken, function (req, res) {
        //console.log(req.decoded);
        var bus = req.query.bus;
        var subway = req.query.subway;
        var train = req.query.train;
        var tram = req.query.tram;
        var rail = req.query.rail;

        if(bus == "" | subway == "" | train == "" | tram == ""| rail ==""){
            res.json({ result: 'error' });
        }
        console.log(req.decoded.userid);
        var sql = "UPDATE TRANSIT_PREF SET BUS= "+bus+", SUBWAY="+subway+", TRAIN="+train+", TRAM="+tram+",RAIL="+rail+" WHERE USERID=" + req.decoded.userid;
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                res.json({ result: 'error' });
            } else {
                res.json({ result: 'success', data: rows });
            }
        })
        connection.end();
    })

};
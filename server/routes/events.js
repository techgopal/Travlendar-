
var verifyToken = require('./verifytoken');
var moment = require('moment');

module.exports = function (app) {
    // createEventService
    app.post('/api/event/create', verifyToken, function (req, res) {
        //read userid from decoded token
        var userId = req.decoded.userid;
        //Read inputs from body of rest call
        var eventName = req.body.eventName;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var isAllDay = req.body.isAllDay;

        var isTTEnabled = req.body.isTTEnabled;
        var startLoc = req.body.startLocation;
        var endLoc = req.body.meetingLocation;
        var travelTime = req.body.travelTime;
        var travelDis = req.body.travelDistance;

        //check input values
        if (userId == null || userId == undefined || userId == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User ID' });
        }
        if (eventName == null || eventName == undefined || eventName == "") {
            return res.status(400).json({ status: 'error', errorcode: 102, errormsg: 'Invalid Event Name' });
        }
        if (startTime == null || startTime == undefined || startTime == "") {
            return res.status(400).json({ status: 'error', errorcode: 103, errormsg: 'Invalid Start Time' });
        }
        if (endTime == null || endTime == undefined || endTime == "") {
            return res.status(400).json({ status: 'error', errorcode: 104, errormsg: 'Invalid End Time' });
        }
        if (isAllDay == null) {
            return res.status(400).json({ status: 'error', errorcode: 105, errormsg: 'Invalid isAllDay' });
        }
        if (endLoc == null || endLoc == undefined || endLoc == "") {
            return res.status(400).json({ status: 'error', errorcode: 107, errormsg: 'Invalid Start Location' });
        }

        //typecast input dates to mysql format
        var mysqlStartTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
        var mysqlEndTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

        //check date constrains
        if (mysqlEndTime < mysqlStartTime || mysqlEndTime == mysqlStartTime) {
            return res.status(400).json({ status: 'error', errorcode: 110, errormsg: 'Invalid Start & End Date' });
        }

        //SQL Query to Insert event
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection Error' });
            } else {
                var sql_location = "INSERT INTO LOCATION values(default," + isTTEnabled + ",'" + startLoc + "','" + endLoc + "','" + travelTime + "','" + travelDis + "')"
                connection.query(sql_location, function (err, results) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        var sql_event = "INSERT INTO EVENTS values(default," + userId + ",'" + eventName + "'," + isAllDay + ",'" + startTime + "','" + endTime + "','" + results.insertId + "')"
                        connection.query(sql_event, function (err, results) {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                            } else {
                                return res.status(200).json({ status: 'success' });
                            }
                        })//Nested Query End
                    }
                    //release connection
                    connection.end();
                })
            }
        });//connection
    });

    //get all events
    app.get('/api/event/all', verifyToken, function (req, res) {
        var sql = "SELECT * FROM EVENTS WHERE USERID=" + req.decoded.userid;
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                res.json({ result: 'error', errorcode: 112, errormsg: err.sqlMessage });
            } else {
                res.json({ result: 'success', data: rows });
            }
        })
        connection.end();
    })

    //get location for events
    app.get('/api/event/location', verifyToken, function (req, res) {
        var eventid = req.query.eventId;
        connection.connect();
        var sql_events = "SELECT LOCATIONID FROM EVENTS WHERE USERID=" + req.decoded.userid + " AND EVENTID=" + eventid;
        connection.query(sql_events, function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.json({ result: 'error' });
            } else {
                //SELECT LOCATION 
                var sql_location = "SELECT * FROM LOCATION WHERE LOCATIONID=" + rows[0].LOCATIONID;
                connection.query(sql_location, function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        res.json({ result: 'error' });
                    } else {
                        res.json({ result: 'success', data: rows });
                    }
                    connection.end();
                });//Inner Query End
            }
        })//Query Outer End
    })

    //delete events
    app.get('/api/event/delete', verifyToken, function (req, res) {
        var eventid = req.query.eventId;
        connection.connect();
        var sql_events = "SELECT LOCATIONID FROM EVENTS WHERE USERID=" + req.decoded.userid + " AND EVENTID=" + eventid;
        connection.query(sql_events, function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.json({ result: 'error' });
            } else {
                var sql_location = "DELETE FROM LOCATION WHERE LOCATIONID=" + rows[0].LOCATIONID;
                connection.query(sql_location, function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        res.json({ result: 'error' });
                    } else {
                        var sql_event_del = "DELETE FROM EVENTS WHERE USERID=" + req.decoded.userid + " AND EVENTID=" + eventid;
                        connection.query(sql_event_del, function (err, rows, fields) {
                            if (err) {
                                console.log(err);
                                res.json({ result: 'error' });
                            } else {
                                res.json({ result: 'success', data: rows });
                            }
                        })
                        connection.end();
                    }
                });
            }

        })
    })

    // updateEventService
    app.post('/api/event/update', verifyToken, function (req, res) {
        //read userid from decoded token
        var userId = req.decoded.userid;
        //Read inputs from body of rest call
        var eventId = req.body.eventId;
        var eventName = req.body.eventName;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var isAllDay = req.body.isAllDay;

        var locationId = req.body.locationId;
        var isTTEnabled = req.body.isTTEnabled;
        var startLoc = req.body.startLocation;
        var endLoc = req.body.meetingLocation;
        var travelTime = req.body.travelTime;
        var travelDis = req.body.travelDistance;

        //check input values
        if (userId == null || userId == undefined || userId == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User ID' });
        }
        if (eventName == null || eventName == undefined || eventName == "") {
            return res.status(400).json({ status: 'error', errorcode: 102, errormsg: 'Invalid Event Name' });
        }
        if (startTime == null || startTime == undefined || startTime == "") {
            return res.status(400).json({ status: 'error', errorcode: 103, errormsg: 'Invalid Start Time' });
        }
        if (endTime == null || endTime == undefined || endTime == "") {
            return res.status(400).json({ status: 'error', errorcode: 104, errormsg: 'Invalid End Time' });
        }
        if (isAllDay == null) {
            return res.status(400).json({ status: 'error', errorcode: 105, errormsg: 'Invalid isAllDay' });
        }
        if (endLoc == null || endLoc == undefined || endLoc == "") {
            return res.status(400).json({ status: 'error', errorcode: 107, errormsg: 'Invalid Start Location' });
        }

        //typecast input dates to mysql format
        var mysqlStartTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
        var mysqlEndTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

        //check date constrains
        if (mysqlEndTime < mysqlStartTime || mysqlEndTime == mysqlStartTime) {
            return res.status(400).json({ status: 'error', errorcode: 110, errormsg: 'Invalid Start & End Date' });
        }

        //SQL Query to Insert event
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection Error' });
            } else {
                console.log(isTTEnabled);
                var sql_location = "UPDATE LOCATION SET ISTTENABLED=" + isTTEnabled + ", STARTLOC='" + startLoc + "', ENDLOC='" + endLoc + "', TIME='" + travelTime + "', DISTANCE='" + travelDis + "' WHERE LOCATIONID='" + locationId + "'"
                connection.query(sql_location, function (err, results) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        var sql_event = "UPDATE EVENTS SET EVENTNAME='" + eventName + "', ISALLDAY=" + isAllDay + ", STARTTIME='" + startTime + "', ENDTIME='" + endTime + "' WHERE EVENTID=" + eventId
                        connection.query(sql_event, function (err, results) {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                            } else {
                                return res.status(200).json({ status: 'success' });
                            }
                        })
                    }
                    //release connection
                    connection.end();
                })
            }
        });//connection
    });

    // ADD BULK DEFAULT EVENT FOR USER
    app.get('/api/event/break/newuser', function (req, res) {
        var userId = req.query.userid;
        //Read inputs from body of rest call
        var eventName = "Lunch Break";
        var isAllDay = 0;

        var isTTEnabled = 0;
        var startLoc = "";
        var endLoc = "";
        var travelTime = "";
        var travelDis = "";

        //check input values
        if (userId == null || userId == undefined || userId == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User ID' });
        }

        //SQL Query to Insert event
        connection.connect(function (err, callback) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 111, errormsg: 'SQL Connection Error' });
            } else {
                var lunch_values = [];
                for (var i = 1; i < 90; i++) {
                    var startTime = "2018-01-01 12:30:00"
                    var endTime = "2018-01-01 13:00:00"
                    //typecast input dates to mysql format
                    var mysqlStartTime = moment(startTime).add(i, 'days').format('YYYY-MM-DD HH:mm:ss');
                    var mysqlEndTime = moment(endTime).add(i, 'days').format('YYYY-MM-DD HH:mm:ss');
                    var lunch_event = [userId, eventName, isAllDay, mysqlStartTime, mysqlEndTime, 1];
                    lunch_values.push(lunch_event);
                }
                var sql_event = "INSERT INTO EVENTS(USERID,EVENTNAME,ISALLDAY,STARTTIME,ENDTIME,LOCATIONID) values ?"
                connection.query(sql_event, [lunch_values], function (err, results) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status: 'error', errorcode: 111, errormsg: err.sqlMessage });
                    } else {
                        console.log(results);
                        return res.status(200).json({ status: 'success' });
                    }
                    //release connection
                    //connection.end();
                })
            }
        });//connection
    });

    //Update DEFAULT BREAK
    //get location for events
    app.get('/api/event/break/update', verifyToken, function (req, res) {
        //HH:MM:SS
        var startTime = req.query.startTime;
        var endTime = req.query.endTime;

        //check input values
        if (startTime == null || startTime == undefined || startTime == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User ID' });
        }
        //check  values
        if (endTime == null || endTime == undefined || endTime == "") {
            return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid User ID' });
        }
        connection.connect();
        var sql_events = "SELECT * FROM EVENTS WHERE USERID=" + req.decoded.userid + " AND EVENTNAME LIKE 'Lunch Break'";
        connection.query(sql_events, function (err, rows, fields) {
            if (err) {
                //console.log(err);
                res.json({ result: 'error' });
            } else {
                var startDateSQL = moment(rows.startTime).format('YYYY-MM-DD');
                var startDateTimeSQL = moment(startDateSQL + " " + startTime).format('YYYY-MM-DD HH:mm:ss');
                var endDateSQL = moment(rows.endTime).format('YYYY-MM-DD');
                var endDateTimeSQL = moment(endDateSQL + " " + endTime).format('YYYY-MM-DD HH:mm:ss');
                console.log(startDateTimeSQL + " --> " + endDateTimeSQL);
                var flgCount = 0;
                for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i].eventid);
                    var sql_update = "UPDATE EVENTS SET STARTTIME='" + startDateTimeSQL + "',ENDTIME='" + endDateTimeSQL + "' WHERE EVENTID=" + rows[i].eventid;
                    connection.query(sql_update, function (err, rows_update, fields) {
                        if (err) {
                            console.log(err);
                            return res.json({ result: 'error' });
                        } else {
                            console.log(rows_update);
                            flgCount = flgCount + rows_update.affectedRows;
                            if (flgCount == rows.length) {
                                connection.end();
                                return res.json({ result: 'success', data: rows });
                            }
                        }
                        //
                    });
                }
            }
        })
    })

    //get all events
    app.get('/api/event/timeconstraint', verifyToken, function (req, res) {
        //FETCH USERID FROM TOKEN
        var userId = req.decoded.userid;
        //READ FROM QUERY
        var startTime = req.query.startTime;
        var travelTime = req.query.travelTime;

        //search most recent meeting on that day
        var sql = "select * from events where endTime >= '" + startTime + "' and userId = " + userId + " order by endTime DESC"
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'SQL ERROR' });
            } else {
                //if no meeting before
                if (rows.length == 0) {
                    return res.json({ result: 'success' });
                } else {
                    var prevEventTime = moment(rows[0].endTime).format('YYYY-MM-DD HH:mm:ss');
                    //if last meeting location is same as
                    console.log(prevEventTime);
                    var splitedTT = travelTime.split(" ");
                    //mins
                    //var subtractedStartTime;
                    console.log(splitedTT);
                    if (splitedTT[1] == 'mins') {
                        subtractedStartTime = moment(startTime).subtract({ 'minutes': splitedTT[0] }).format('YYYY-MM-DD HH:mm:ss');
                    }
                    if (splitedTT[1] == 'hours') {
                        subtractedStartTime = moment(startTime).subtract({ 'minutes': splitedTT[2], 'hours': splitedTT[0] }).format('YYYY-MM-DD HH:mm:ss');
                    }
                    if (prevEventTime == subtractedStartTime || prevEventTime > subtractedStartTime) {
                        return res.status(400).json({ status: 'error', errormsg: 'Meeting Location is not reachable in allocated Time' });
                    } else {
                        return res.json({ result: 'success' });
                    }
                }
            }
            connection.end();
        })
    })

}
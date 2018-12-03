var verifyToken = require('./verifytoken');
module.exports = function (app, client) {
    //location suggetion
    var uri = 'https://maps.googleapis.com/maps/api';
    app.get('/api/maps/locationSuggestion', verifyToken, function (req, res) {
        // direct way 
        var input = req.query.input;
        var key = 'AIzaSyD-V1U_DxyTJXqAbpD86aOls3roKj0bsVg';
        client.get(uri+'/place/autocomplete/json?input=' + input + '&type=geocode&components=country:it&language=en_EN&key='+key, function (data, response) {
            // parsed response body as js object 
            res.send(data);
        });
    });
    app.get('/api/maps/calculateDistTime', verifyToken, function (req, res) {
        // direct way 
        var startLocation = req.query.startLocation;
        var endLocation = req.query.endLocation;
        //console.log(startLocation + endLocation);
        var key = 'AIzaSyD-V1U_DxyTJXqAbpD86aOls3roKj0bsVg';
        client.get(uri+'/distancematrix/json?&origins='+startLocation+'&destinations='+endLocation+'&key='+key, function (data, response) {
            // parsed response body as js object 
            res.send(data);
        });
    });
    app.get('/api/maps/directions', verifyToken, function (req, res) {
        // direct way 
        var startLocation = req.query.startLocation;
        var endLocation = req.query.endLocation;
        var mode = req.query.mode;
        //console.log(uri+'/directions/json?origin='+startLocation+'&destination='+endLocation+'&alternatives=true&mode='+mode+'&key='+key);
        var key = 'AIzaSyD-V1U_DxyTJXqAbpD86aOls3roKj0bsVg';
        client.get(uri+'/directions/json?origin='+startLocation+'&destination='+endLocation+'&alternatives=true&mode='+mode+'&key='+key, function (data, response) {
            // parsed response body as js object 
            return res.json({ result: 'success', data: data });
        });
    });
    //TRANSSITMODE
    app.get('/api/maps/directions/transitmode', verifyToken, function (req, res) {
        // direct way 
        var startLocation = req.query.startLocation;
        var endLocation = req.query.endLocation;
        var mode = req.query.mode;
        var tmode = req.query.tmode;
       // console.log(uri+'/directions/json?origin='+startLocation+'&destination='+endLocation+'&alternatives=true&mode='+mode+'&key='+key);
        var key = 'AIzaSyD-V1U_DxyTJXqAbpD86aOls3roKj0bsVg';
        client.get(uri+'/directions/json?origin='+startLocation+'&destination='+endLocation+'&alternatives=true&mode='+mode+'&transit_mode='+tmode+'&key='+key, function (data, response) {
            // parsed response body as js object 
            return res.json({ result: 'success', data: data });
        });
    });
}
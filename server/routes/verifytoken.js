var jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    var token = req.body.token || req.query.token || req.headers['token'];
      if (token) {
      // verifies secret and checks exp
          jwt.verify(token, 'ssss', function(err, decoded) {
              if (err) { //failed verification.
                  return res.status(400).json({ status: 'error', errorcode: 101, errormsg: 'Invalid JWT Token' });
              }
              req.decoded = decoded;
              next(); //no error, proceed
          });
      } else {
          // forbidden without token
          return res.status(403).send({
              "error": true,
              errorcode: 101,
              errormsg: 'Please Provide Token'
          });
      }
  }
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var Users = require('../models/userModel');
var verifyToken = require('../auth/verifyToken')
var bodyParser = require('body-parser');

module.exports = function(app) {
    
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/api/auth/register', function(req, res) {
  
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    Users.create({
      name : req.body.name,
      email : req.body.email,
      password : hashedPassword
    },
    function (err, users) {
      if (err) return res.status(500).send("There was a problem registering the users.")
      // create a token
      var token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    }); 
  });

  app.get('/api/auth/me', verifyToken, function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      Users.findById(decoded.id, { password: 0 }, // projection
        function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!users) return res.status(404).send("No user found.");
        
        res.status(200).send(users);
      });
    });
  });

  app.post('/api/auth/login', function(req, res) {

    Users.findOne({ email: req.body.email }, function (err, users) {
      if (err) return res.status(500).send('Error on the server.');
      if (!users) return res.status(404).send('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, users.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      
      res.status(200).send({ auth: true, token: token });
    });
    
  });

  app.get('/api/auth/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });
  
}

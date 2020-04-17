var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Userschema = new Schema({
    name: String,
    email: String,
    password: String
});

var Users = mongoose.model('Users', Userschema);

module.exports = Users;
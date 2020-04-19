var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderSchema = new Schema({
    name: String,
    status: String,
    price: String,
    isPaid: String,
    dateReceived: String,
    dateReturned: String,
    qr: String
});

var Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
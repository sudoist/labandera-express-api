var QRCode = require('qrcode');
var fs = require('fs');
var cloudinary = require('cloudinary').v2;

var Orders = require('../models/orderModel');
var bodyParser = require('body-parser');
var verifyToken = require('../auth/verifyToken')

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/orders/', verifyToken, function (req, res) {
        Orders.find({}, function(err, orders) {
            if (err) throw err;
            
            res.send(orders);
        });
      })
    
    app.get('/api/orderByName/:name', verifyToken, function(req, res) {
        
        Orders.findOne({ name: req.params.name }, function(err, order) {
            if (err) throw err;
            
            res.send(order);
        });
        
    });

    app.get('/api/ordersByName/:name', verifyToken, function(req, res) {
        
        Orders.find({ name: req.params.name }, function(err, orders) {
            if (err) throw err;
            
            res.send(orders);
        });
        
    });
    
    // Should work even if not authenticated for qr code scanning
    app.get('/api/order/:id', function(req, res) {
       
       Orders.findById({ _id: req.params.id }, function(err, order) {
           if (err) throw err;
           
           res.send(order);
       });
        
    });
    
    app.post('/api/order/', verifyToken, function(req, res) {
        
        if (req.body.id) {
            Orders.findByIdAndUpdate(
                req.body.id, 
                {
                    name: req.body.name,
                    status: req.body.status,
                    price: req.body.price,
                    isPaid: req.body.isPaid,
                    dateReceived: req.body.dateReceived,
                    dateReturned: req.body.dateReturned
                },
                function(err, order) {
                    if (err) throw err;
                    res.send('Order updated successfully');
                }
            );
        }
        
        else {
           
           var newOrder = Orders({
                name: req.body.name,
                status: req.body.status,
                price: req.body.price,
                isPaid: req.body.isPaid,
                dateReceived: req.body.dateReceived,
                dateReturned: req.body.dateReturned
           });
           newOrder.save(function(err) {
               if (err) throw err;
            //    res.send('Success');

                QRCode.toFile('./public/images/' + newOrder._id + '.png', '' + newOrder._id + '', {
                    color: {
                    dark: '#00F',  // Blue dots
                    light: '#0000' // Transparent background
                    }
                }, function (err) {
                    if (err) throw err

                    // QR generated.

                    const uploadPath = 'labandera/qrcode';

                    // Upload to Cloudinary
                    cloudinary.uploader.upload('./public/images/' + newOrder._id + '.png', { folder: uploadPath }, function (err, image) {
                        if (err) { console.warn(err); }

                        Orders.findByIdAndUpdate(
                            newOrder._id, 
                            {
                                qr: image.url
                            },
                            function(err, order) {
                                if (err) throw err;
                            }
                        );

                    });

                    res.status(200).send({ id: newOrder._id, order_created: 'success' });
                })
           });
            
        }
        
    });
    
    app.delete('/api/order/:id', verifyToken, function(req, res) {
        
        Orders.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Success');
        })
        
    });
    
}
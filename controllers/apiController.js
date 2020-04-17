var Orders = require('../models/orderModel');
var bodyParser = require('body-parser');

module.exports = function(app) {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/orders/', function (req, res) {
        Orders.find({}, function(err, orders) {
            if (err) throw err;
            
            res.send(orders);
        });
      })
    
    app.get('/api/orderByName/:name', function(req, res) {
        
        Orders.findOne({ name: req.params.name }, function(err, order) {
            if (err) throw err;
            
            res.send(order);
        });
        
    });

    app.get('/api/ordersByName/:name', function(req, res) {
        
        Orders.find({ name: req.params.name }, function(err, orders) {
            if (err) throw err;
            
            res.send(orders);
        });
        
    });
    
    app.get('/api/order/:id', function(req, res) {
       
       Orders.findById({ _id: req.params.id }, function(err, order) {
           if (err) throw err;
           
           res.send(order);
       });
        
    });
    
    app.post('/api/order', function(req, res) {
        
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
                    res.send('Success');
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
               res.send('Success');
           });
            
        }
        
    });
    
    app.delete('/api/order', function(req, res) {
        
        Orders.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Success');
        })
        
    });
    
}
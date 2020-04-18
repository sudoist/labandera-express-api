var Orders = require('../models/orderModel');

module.exports = function(app) {

    // seed database
    var starterOrders = [
        {
             name: 'Gol D',
             status: 'Ready for Pickup/Delivery',
             price: '112',
             isPaid: 'Paid',
             dateReceived: '2020-01-13',
             dateReturned: ''
         },
         {
             name: 'Silva',
             status: 'Washing in progress',
             price: '358',
             isPaid: 'NA',
             dateReceived: '2020-02-04',
             dateReturned: ''
         },
         {
             name: 'Coppa',
             status: 'Order Complete',
             price: '132',
             isPaid: 'Paid',
             dateReceived: '2020-01-29',
             dateReturned: '2020-02-03'
         },
         {
             name: 'Tungstan',
             status: 'Queued',
             price: '124',
             isPaid: 'Paid',
             dateReceived: '2020-01-22',
             dateReturned: ''
         },
         {
             name: 'Stell',
             status: 'Order Complete',
             price: '420',
             isPaid: 'Paid',
             dateReceived: '2020-01-15',
             dateReturned: '2020-01-19'
         },
         {
             name: 'Buras',
             status: 'Ready for Pickup/Delivery',
             price: '300',
             isPaid: 'NA',
             dateReceived: '2020-01-10',
             dateReturned: ''
         },
         {
             name: 'Tin',
             status: 'Washing in progress',
             price: '220',
             isPaid: 'NA',
             dateReceived: '2020-02-14',
             dateReturned: ''
         },
         {
             name: 'Almunim',
             status: 'Washing in progress',
             price: '195',
             isPaid: 'Paid',
             dateReceived: '2020-02-23',
             dateReturned: '2020-02-27'
         }
    ];
    
   app.get('/api/seedOrders', function(req, res) {

        Orders.find({}, function(orders) {
            
            if (orders === null) {
                
                Orders.create(starterOrders, function(err, results) {
                    if (err) return handleError(err);
                }); 

                res.send('Success');

                return;
            }
            
            res.send('Database is not empty.');
        });
       
       
   });
    
}
/**
 * Created by BruceWayne on 10/01/2015.
 * Want to model
 *
 * 1. Create an Order [DONE]
 * 2. Retrieve Specific Order for a given Customer [DONE]
 * 3. Retrieve All Orders for a given Customer  [DONE]
 *
 * !!!! 4. Update Specific Order for a given Customer
 *
 * 5. Update All Orders for a given Customer [NICE TO HAVE]
 * 6. Update All Orders for All Customers [NICE TO HAVE]
 *
 * !!! 7. Delete Specific Order for a given Customer
 *
 * 8. Delete All Orders for a given Customer.  [NICE TO HAVE]
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Customer = mongoose.model('Customer'),
    Order = mongoose.model('Order'),
    _ = require('lodash'),
    ObjectId = require('mongoose').Types.ObjectId;

/**
 * Create a Order
 * Demo this in 2 ways
 *  a.) Option I - Save Changes
 *      1. Get Customer
 *      2. Update Customer.Orders array by pushing new Order
 *      3. Save Customer
 *
 *  b.) Option II - database update
 *      1. use findByIdAndUpdate()
 *
 *
 *  think option II is better to avoid concurrent issues.
 *  Assume that in case I, you and another party retrieve Customer,
 *  then each of you perform update. The last one will be performing update
 *  on stale version.
 */
exports.create = function(req, res) {

    console.log('[DDT] order.server.controller > body: ' + JSON.stringify(req.body));

    //get customer id
    var customerId = req.body.customerId;
    console.log('passed customer id : ' + customerId);

    //Option I:
    //step1 : retrieve Customer
    //step2 : push new Order into Customers list of orders
    //step 3: persist customer
    //Customer.findById(customerId).exec(function(err, customer) {
    //
    //    if (! customer) throw (new Error('Failed to load Customer ' + customerId));
    //
    //    console.log('1.) located Customer: ' + JSON.stringify(customer));
    //    console.log('2.) Order in raw format: ' + JSON.stringify(req.body));
    //
    //    var order = req.body;
    //
    //    customer.orders.push(order);
    //
    //    customer.save(function(err) {
    //        if (err) {
    //            console.log('[ERROR] : ' + err);
    //            return res.status(400).send({
    //                message: errorHandler.getErrorMessage(err)
    //            });
    //        } else {
    //
    //            //test that order has bee saved correctly
    //            Customer.findById(customerId).populate('orders.orderItems.item').exec(function(err, cust){
    //                if (! customer) throw (new Error('Failed to load Customer ' + customerId));
    //
    //                console.log('Saved Customer: ' + JSON.stringify(cust) );
    //                res.jsonp(customer);
    //
    //            });
    //            //end test
    //        }
    //    });
    //});

    //Option 2:
    //step1 : Create new Order instance
    //step2: locate Customer and perform update.
    //used findByIdAndUpdate()

    //extract the order object - used to update the Customer.orders array
    var order = req.body;

    /**
     * @params customerId - the customer id
     * @params order - use $push to insert a new order into the Customers array of orders
     * safe - Use Mongo's Write Concerns to force it to write the data to disk (ensures no data lost)
     * upsert - perform insert if update not possible which is the case here although seems to work without this config
     */
    Customer.findByIdAndUpdate(customerId, {$push : {orders:order}},{safe:true, upsert:true}, function(err, updatedCustomer){

        if (! updatedCustomer) throw (new Error('Failed to load Customer ' + customerId));

        console.log('updated Customer : ' + JSON.stringify(updatedCustomer));

        res.jsonp(updatedCustomer);
    });


};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
    console.log('Arrived at the server..');
    console.log('req.params: ' + JSON.stringify(req.params));
    console.log('req.body: ' + JSON.stringify(req.body));

    //option 3- find customer by id and then use aggregation framework to only return required Order
//    Customer.find({'_id':req.params.customerId},
//                    {
//
////                    $match:{'orders._id':req.params.orderId},
//                     orders:{$elemMatch:{_id:req.params.orderId}}
//                    },
//        function(err, customer){
//            if(err) console.log(err);
//            if(!customer) throw (new Error('failed to load order'));
//        console.log('retrieved customer: ' + JSON.stringify(customer));
//        res.jsonp(customer[0].orders[0]);
//    });
//

    //find customer, project only matching order and then use populate to pull it back
    Customer.find({'_id':req.params.customerId}, //query parameter
        {
            //will only return 1st matching element of orders array
            orders:{$elemMatch:{_id:req.params.orderId}}
        }) // projection parameter
        //do we need orders/order.orderItems. We only use references from Item model so maybe just declare this in the populate mehtod.
            .populate('orders orders.orderItems orders.orderItems.item').exec(

                function(err, customer){
                    if(err) console.log(err);
                    if(!customer) throw (new Error('failed to load order'));
                    console.log('retrieved customer: ' + JSON.stringify(customer));
                res.jsonp(customer[0].orders[0]);
        });


};

/**
 * Update a Customer
 */
//exports.update = function(req, res) {
//    var customer = req.customer ;
//
//    customer = _.extend(customer , req.body);
//
//    customer.save(function(err) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.jsonp(customer);
//        }
//    });
//};

/**
 * Delete an Customer
 */
//exports.delete = function(req, res) {
//    var customer = req.customer ;
//
//    customer.remove(function(err) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.jsonp(customer);
//        }
//    });
//};

/**
 * List of Orders for a Customer
 */
exports.list = function(req, res) {

    //it's a GET and not POST, so customerId is supplied as a request params.
    //compare to the POST in the create() method which gets hold of the customerId
    //via req.body.customerId since the data passed in POST is in the body.

    var customerId = req.params.customerId;

    console.log('[list] passed customer id : ' + customerId);

    //do we need orders/order.orderItems. We only use references from Item model so maybe just declare this in the populate mehtod.
    Customer.findById(customerId).populate('orders orders.orderItems orders.orderItems.item').exec(function(err, customer){

        if (err) {
            return res.status(400).send({
                                            message: errorHandler.getErrorMessage(err)
                                        });
        }
        else {
            var orders = customer.orders;
            console.log('Customer has num orders: ' + orders.length);
            console.log('Customer has following orders: ' + JSON.stringify(orders));
            res.jsonp(orders);
        }


    });


};


/**
 * Customer middleware
 */
//exports.customerByID = function(req, res, next, id) { Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
//    if (err) return next(err);
//    if (! customer) return next(new Error('Failed to load Customer ' + id));
//    req.customer = customer ;
//    next();
//});
//};

/**
 * Customer authorization middleware
 */
//exports.hasAuthorization = function(req, res, next) {
//    if (req.customer.user.id !== req.user.id) {
//        return res.status(403).send('User is not authorized');
//    }
//    next();
//};

/**
 * Created by BruceWayne on 10/01/2015.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Customer = mongoose.model('Customer'),
    Order = mongoose.model('Order'),
    _ = require('lodash');

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
//exports.read = function(req, res) {
//    res.jsonp(req.customer);
//};

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

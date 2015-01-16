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
 */
exports.create = function(req, res) {

    console.log('[DDT] order.server.controller > body: ' + JSON.stringify(req.body));

    //Option 1:
    //step1 : retrieve Customer
    //step2 : push new Order into Customers list of orders
    //step 3: persist customer
    var customerId = req.body.customerId;

    console.log('passed customer id : ' + customerId);
    Customer.findById(customerId).exec(function(err, customer) {
//        if (err) return next(err);
//        if (! customer) return next(new Error('Failed to load Customer ' + id));
        if (! customer) throw (new Error('Failed to load Customer ' + customerId));

        console.log('located Customer: ' + JSON.stringify(customer));
        var order = new Order(req.body);

        console.log('created Order instance: ' + JSON.stringify(order));

        customer.orders.push(order);

        customer.save(function(err) {
            if (err) {
                console.log('[ERROR] : ' + err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(customer);
            }
        });

//        next();
    });

    //Option 2:
    //step1 : Create new Order instance
    //step2: locate Customer and perform update.


    //var order = new Order(req.body);
    //
    //console.log('[DDT] order.server.controller > Order: ' + JSON.stringify(order));
    //
    //
    //order.save(function(err) {
    //    if (err) {
    //        console.log('[ERROR] : ' + err);
    //        return res.status(400).send({
    //            message: errorHandler.getErrorMessage(err)
    //        });
    //    } else {
    //        res.jsonp(order);
    //    }
    //});
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
 * List of Customers
 */
//exports.list = function(req, res) { Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
//    if (err) {
//        return res.status(400).send({
//            message: errorHandler.getErrorMessage(err)
//        });
//    } else {
//        res.jsonp(customers);
//    }
//});
//};

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

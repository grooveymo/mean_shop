'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash');

/**
 * Create a Customer
 */
exports.create = function(req, res) {

    //console.log('[DDT] customer.server.controller > body: ' + JSON.stringify(req.body));
    //console.log('[DDT] customer.server.controller > personalDetails: ' + JSON.stringify(req.body.personalDetails));
    //console.log('[DDT] customer.server.controller > address: ' + JSON.stringify(req.body.addressDetails));
    //console.log('[DDT] customer.server.controller > phone: ' + JSON.stringify(req.body.phoneDetails));
    //console.log('[DDT] customer.server.controller > user: ' + JSON.stringify(req.body.user));

    //compare to Article code.s
    //var article = new Article(req.body);
    //article.user = req.user;

    //Note that passport uses it's serializeUser() method [/app/config/passport.js] to inject in the user ._id as the param req.user
    //This means that the new Customer() instance created below will have the ObjectId as it's user value therefore
    //complying with the Customer Schema.
    var customer = new Customer(req.body);
	customer.user = req.user;

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
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
//	console.log('OVER HERE !!!!!!!');
	res.jsonp(req.customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
	var customer = req.customer ;

	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {

    console.log('[delete] about to delete customer with _id: '+ req.customer._id);
	var customer = req.customer ;

	customer.remove(function(err) {
		if (err) {
            console.log('[delete] error attempting to delete customer : ' + err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            console.log('[delete] succeeded in deleting customer : ' + customer._id);

            res.jsonp(customer);
		}
	});
};

/**
 * List of Customers
 */
exports.list = function(req, res) {

    Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {

			if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            //console.log('[Ctrl#list] user: ' + customers[0].user);
            //console.log('[Ctrl#list] cusomters: ' + customers);
			res.jsonp(customers);
		}
	});
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) { Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (! customer) return next(new Error('Failed to load Customer ' + id));
		req.customer = customer ;
		next();
	});
};

/**
 * Customer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    console.log('[hasAuthorization] customer.user.id: ' + req.customer.user.id + ' <===> req.user.id: ' + req.user.id);
	if (req.customer.user.id !== req.user.id) {
        console.log('[hasAuthorization] failed authorisation');
		return res.status(403).send('User is not authorized');
	}
	next();
};

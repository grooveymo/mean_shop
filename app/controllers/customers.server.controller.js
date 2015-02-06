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

//    console.log('[Ctrl#create] req: ' + JSON.stringify(req));

    console.log('[DDT] customer.server.controller > body: ' + JSON.stringify(req.body));
	console.log('[DDT] customer.server.controller > personalDetails: ' + JSON.stringify(req.body.personalDetails));
	console.log('[DDT] customer.server.controller > address: ' + JSON.stringify(req.body.addressDetails));
    console.log('[DDT] customer.server.controller > phone: ' + JSON.stringify(req.body.phoneDetails));
    console.log('[DDT] customer.server.controller > user: ' + JSON.stringify(req.body.user));

    //compare to Article code.s
    //var article = new Article(req.body);
    //article.user = req.user;

    var customer = new Customer(req.body);

	console.log('[DDT] customer.server.controller > Customer: ' + JSON.stringify(customer));
    //TODO: how come the cast from user obj to user._id works for the Article code and not here?
    //TODO: Question - Am i creating the Customer object correctly???
    //Answer: No I pass in the user object in the req.customer object
	customer.user = req.user;

	customer.save(function(err) {
		if (err) {
            //TODO : WHY do we get 'CastError: cast to objectId failed for value "[object Object]" at path "user"
            // is the code expecting an _id rather than  user object ??

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
	console.log('OVER HERE !!!!!!!');
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
	var customer = req.customer ;

	customer.remove(function(err) {
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
	if (req.customer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

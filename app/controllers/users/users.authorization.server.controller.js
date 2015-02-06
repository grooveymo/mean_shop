'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {

    console.log('[requiresLogin] req.isauthenticated: ' + req.isAuthenticated());
    console.log('[requiresLogin] req has session cookie: ' + JSON.stringify(req.headers['cookie']));

    //var cache = [];
    //console.log('[TTTT]' +
    //JSON.stringify(req, function(key, value) {
    //    if (typeof value === 'object' && value !== null) {
    //        if (cache.indexOf(value) !== -1) {
    //            // Circular reference found, discard key
    //            return;
    //        }
    //        // Store value in our collection
    //        cache.push(value);
    //    }
    //    return value;
    //})//;
    //);
    //
    //cache = null; // Enable garbage collection



    if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

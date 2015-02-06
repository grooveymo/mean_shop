'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Customer = mongoose.model('Customer');

/**
 * Globals
 */
var user, customer;

/**
 * Unit tests
 */
//describe('Customer Model Unit Tests:', function() {
//	beforeEach(function(done) {
//		user = new User({
//			firstName: 'Full',
//			lastName: 'Name',
//			displayName: 'Full Name',
//			email: 'test@test.com',
//			username: 'username',
//			password: 'password'
//		});
//
//		user.save(function() {
//			customer = new Customer({
//				name: 'Customer Name',
//				user: user
//			});
//
//			done();
//		});
//	});
//
//	describe('Method Save', function() {
//		it('should be able to save without problems', function(done) {
//            customer.personalDetails.forename = 'firstname';
//            customer.personalDetails.surname = 'lastname';
//            customer.personalDetails.dob = '11/12/13';
//            customer.addressDetails.firstLine='firstLine';
//            customer.addressDetails.city='city';
//            customer.addressDetails.postCode='postcode';
//
//            return customer.save(function(err) {
//                console.log('[TEST] error saving Customer: ' + JSON.stringify(err));
//				should.not.exist(err);
//				done();
//			});
//		});
//
//		it('should be able to show an error when try to save without name', function(done) {
//			customer.name = '';
//
//			return customer.save(function(err) {
//				should.exist(err);
//				done();
//			});
//		});
//	});
//
//	afterEach(function(done) {
//		Customer.remove().exec();
//		User.remove().exec();
//
//		done();
//	});
//});

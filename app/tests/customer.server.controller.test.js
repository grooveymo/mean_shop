/**
 * Created by BruceWayne on 30/01/2015.
 */
// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Customer = mongoose.model('Customer');

// Define global test variables
var user, customer;

//set debug on mongoose
//mongoose.set('debug',true);

// Create an 'Articles' controller test suite
describe('Customer Controller Unit Tests:', function() {
    // Define a pre-tests function
    beforeEach(function(done) {
        // Create a new 'User' model instance
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name XXX',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        // Save the new 'User' model instance
        user.save(function(err) {

            if(err) console.log('[beforeEach] Error saving user: ' + JSON.stringify(err) );

            var personalDetails = {
                forename : 'firstname',
                surname : 'lastname',
                dob : '11/12/13'
                };

            var addressDetails = {
            firstLine : 'firstLine',
            city : 'city',
            postCode : 'postcode'
            };

            customer = new Customer({
                'personalDetails' : personalDetails,
                'addressDetails' : addressDetails,
                'user' : user
            });

            return customer.save(function(err) {
                if (err) console.log('[SuperTest] error saving Customer: ' + JSON.stringify(err));
                should.not.exist(err);
                done();
            });

        });
    });

    // Test the 'Article' GET methods
    describe('Testing the GET methods', function() {
        it('Should be able to get the list of Customers', function(done) {
            //// Create a SuperTest request
            //request(app).get('/api/articles/')
            //    .set('Accept', 'application/json')
            //    .expect('Content-Type', /json/)
            //    .expect(200)
            //    .end(function(err, res) {
            //        res.body.should.be.an.Array.and.have.lengthOf(1);
            //        res.body[0].should.have.property('title', article.title);
            //        res.body[0].should.have.property('content', article.content);
            //
            //        done();
            //    });


            // Create a SuperTest request
            request(app).get('/customers/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.Array.and.have.lengthOf(1);
//                    console.log('[it2] body : ' + JSON.stringify(res.body[0]));
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('personalDetails');
                    res.body[0].should.have.property('addressDetails');
                    res.body[0].personalDetails.should.have.property('forename', customer.personalDetails.forename);
                    res.body[0].personalDetails.should.have.property('surname', customer.personalDetails.surname);
                    res.body[0].personalDetails.should.have.property('dob', customer.personalDetails.dob);
                    res.body[0].addressDetails.should.have.property('firstLine', customer.addressDetails.firstLine);
                    res.body[0].addressDetails.should.have.property('city', customer.addressDetails.city);
                    res.body[0].addressDetails.should.have.property('postCode', customer.addressDetails.postCode);
                    done();
                });



        });

        //it('Should be able to get the specific article', function(done) {
        //    // Create a SuperTest request
        //    request(app).get('/api/articles/' + article.id)
        //        .set('Accept', 'application/json')
        //        .expect('Content-Type', /json/)
        //        .expect(200)
        //        .end(function(err, res) {
        //            res.body.should.be.an.Object.and.have.property('title', article.title);
        //            res.body.should.have.property('content', article.content);
        //
        //            done();
        //        });
        //});
    });

    // Define a post-tests function
    afterEach(function(done) {
        // Clean the database
        Customer.remove(function() {
            User.remove(function() {
                done();
            });
        });
    });
});

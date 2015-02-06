/**
 * Created by BruceWayne on 30/01/2015.
 * Tests to be implemented (See customer.server.route.js)

 0. list Customers [GET] ** done ***
 1. create Customer [POST]
 2. get Single Customer [GET]
 3. update Customer [PUT]
 4. delete Customer [DELETE]


 5. Create Order [POST]
 6. get All Orders [GET]
 7. get Specific Order [GET]
 8. update Order (PUT]
 9. delete Order [DELETE]


 Use code below to overcome avoid-typeerror-converting-circular-structure-to-json error
 //var cache = [];
 //console.log('[GGGG]' +
 //JSON.stringify(res, function(key, value) {
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


 */
// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app = require('../../server'),
    request = require('supertest'),
    agent = request.agent(app),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Customer = mongoose.model('Customer');

// Define global test variables
var user, customer;

var cookie;

//set debug on mongoose
//mongoose.set('debug',true);

// Create an 'Articles' controller test suite

describe('[Server] Customer Controller Unit Tests:', function() {

    /**
     * Performs login
     * @param done mocha's done callback - required to terminate async calls. Don't want to invoke here
     *             but simply to pass onto following request
     * @param performRequest The request to perform, e.g. POST to create a new custoemr
     */
    function loginUser(done, performRequest) {

        agent
            .post('/auth/signin')
            .send({ username: 'username', password: 'password' })
            .end(onResponse);
        function onResponse(err, res) {
            console.log('[SIGNIN CB] : ' + JSON.stringify(res.status));
            if(err) console.log('[ERROR-login] : ' + err);
            agent.saveCookies(res);
            console.log('[SIGNIN CB] : about to perform followon request.. ');
            return performRequest(done);
        }
    };

    //Utility function to create Test Customer
    var createCustomer = function(prefix) {


        var personalDetails = {
            forename : prefix + 'firstname',
            surname : prefix + 'lastname',
            dob : prefix + '11/12/13'
        };

        var addressDetails = {
            firstLine : prefix + 'firstLine',
            city : prefix + 'city',
            postCode : prefix + 'postcode'
        };

        var customerJSON = {
            'personalDetails' : personalDetails,
            'addressDetails' : addressDetails//,
//            'user' : user._id
        };

        return customerJSON;
    };

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

//            console.log('[06.02.15] created new User: ' + JSON.stringify(user));
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

    //-----------------------------------
    // Test the 'Customer' GET methods
    //-----------------------------------
    describe('Testing the GET methods', function() {
        xit('Should be able to get the list of Customers', function(done) {
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

    });


    //-----------------------------------
    // Test the 'Customer' POST methods
    //-----------------------------------
    describe('Testing the POST methods', function() {
        xit('Should NOT be able to create a NEW Customer without logging in',function(done){

            var newCustomer = createCustomer('newCustomer_');

            console.log('[06.02.14] newCustomer : ' + JSON.stringify(newCustomer));

            //Create a SuperTest request
            request(app).post('/customers/')
                .set('Accept', 'application/json')
                .send(newCustomer)
                .expect('Content-Type',/json/)
                .end(function(err, res){
                    if(err) console.log('[error]: ' + JSON.stringify(err));
                    res.body.should.have.property('message','User is not logged in');
                    done();
                });
        });


    //=============================================================
    //SOLUTION : START
    //=============================================================
        describe('Should be able to create a NEW Customer if logged in',function(){

            var newCustomer = createCustomer('newCustomer_');

            it('logon pleaseXXX', function(done){
                console.log('does user exists: '+ JSON.stringify(user));
                loginUser(done, function(done){

                    console.log('Authenticated..... now doing post');
                    //Create a SuperTest request
                    var req = agent.post('/customers/')
                        .set('Accept', 'application/json')
                        .send(newCustomer)
                        .expect('Content-Type',/json/)
                        .end(function(err, res){
                            req.expect(200);
                            if(err) console.log('[error]: ' + JSON.stringify(err));
                            res.body.should.not.have.property('message','User is not logged in');
                            res.body.should.have.property('_id');
                            console.log('[SOL] : ' + JSON.stringify(res.body));

                            done();
                        });
                });
            });

            //=============================================================
            //SOLUTION : FINISH
            //=============================================================



        });

    });

    //-----------------------------------
    //test the 'Customer' PUT methods
    //-----------------------------------
    describe('Testing the PUT methods', function() {
        xit('Should be able to update an existing Customer',function(done){
        });
    });



    //-----------------------------------
    //test the 'Customer' DELETE methods
    //-----------------------------------
    describe('Testing the DELETE methods', function() {
        xit('Should be able to delete an existing Customer',function(done){
        });
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

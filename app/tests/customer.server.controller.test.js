/**
 * Created by BruceWayne on 30/01/2015.
 * Tests to be implemented (See customer.server.route.js)

 0. list Customers [GET] ** done ***
 1. create Customer [POST] ** done ***
 2. get Single Customer [GET] ** done ***
 3. update Customer [PUT] ** done ***
 4. delete Customer [DELETE] ** done ***


 5. Create Order [POST]
 6. get All Orders [GET] ** done ***
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

    //use this for methods NOT requiring authentication
    request = require('supertest'),

    //use this for methods requiring authentication
    agent = request.agent(app),

    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Customer = mongoose.model('Customer');

// Define global test variables
var user, customer, user2;

//var cookie;

//set debug on mongoose
//mongoose.set('debug',true);

// Create an 'Articles' controller test suite

xdescribe('[Server] Customer Controller Unit Tests:', function() {

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
//            console.log('[SIGNIN CB] : ' + JSON.stringify(res.status));
            if(err) console.log('[ERROR-login] : ' + err);
    //        agent.saveCookies(res);
//            console.log('[SIGNIN CB] : about to perform follow on request.. ');
            return performRequest(done);
        }
    };

    function loginUser2(done, performRequest) {

        agent
            .post('/auth/signin')
            .send({ username: 'username2', password: 'password2' })
            .end(onResponse);
        function onResponse(err, res) {
//            console.log('[SIGNIN CB] : ' + JSON.stringify(res.status));
            if(err) console.log('[ERROR-login] : ' + err);
            //        agent.saveCookies(res);
//            console.log('[SIGNIN CB] : about to perform follow on request.. ');
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
//        console.log('[beforeEach] 1');
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

            console.log('[user] _id : ' + user._id);

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

    //Create a different user
    beforeEach(function(done) {
//        console.log('[beforeEach] 2');

        // Create a new 'User' model instance
        user2 = new User({
            firstName: 'Full2',
            lastName: 'Name2',
            displayName: 'Full Name 2',
            email: 'test2@test.com',
            username: 'username2',
            password: 'password2'
        });


        // Save the new 'User' model instance
        user2.save(function(err) {
            if(err) console.log('[beforeEach] Error saving user: ' + JSON.stringify(err) );
            console.log('[user2] _id : ' + user2._id);
            done();
        });
    });

    //-----------------------------------
    // Test the 'Customer' GET methods
    //-----------------------------------
    describe('Testing the GET methods', function() {
        it('Should be able to get the list of Customers', function(done) {
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

        it('Should be able to get a specific Customer', function(done) {

            // Create a SuperTest request
            request(app).get('/customers/'+customer._id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
//                    console.log('[it2] body : ' + JSON.stringify(res.body));
                    res.body.should.not.be.an.Array;
                    res.body.should.be.an.Object;
                    res.body.should.have.property('_id');
                    res.body.should.have.property('personalDetails');
                    res.body.should.have.property('addressDetails');
                    res.body.personalDetails.should.have.property('forename', customer.personalDetails.forename);
                    res.body.personalDetails.should.have.property('surname', customer.personalDetails.surname);
                    res.body.personalDetails.should.have.property('dob', customer.personalDetails.dob);
                    res.body.addressDetails.should.have.property('firstLine', customer.addressDetails.firstLine);
                    res.body.addressDetails.should.have.property('city', customer.addressDetails.city);
                    res.body.addressDetails.should.have.property('postCode', customer.addressDetails.postCode);
                    done();
                });

        });

    });


    //-----------------------------------
    // Test the 'Customer' POST methods
    //-----------------------------------
    describe('Testing the POST methods', function() {

        //tests the 'list' method
        it('Should NOT be able to create a NEW Customer without logging in',function(done){

            var newCustomer = createCustomer('newCustomer_');

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


        //tests 'read' method
        it('Should be able to create a NEW Customer if logged in', function(done){

                var newCustomer = createCustomer('newCustomer_');

                //authenticate first
                loginUser(done, function(done){

                    //now attempt to create new Customer
                    var req = agent.post('/customers/')
                        .set('Accept', 'application/json')
                        .send(newCustomer)
                        .expect('Content-Type',/json/)
                        .end(function(err, res){
                            req.expect(200);
                            if(err) console.log('[error]: ' + JSON.stringify(err));
                            res.body.should.not.have.property('message','User is not logged in');
                            res.body.should.have.property('_id');
                            done();
                        });
                });
        });



    });

    //-----------------------------------
    //test the 'Customer' PUT methods
    //-----------------------------------
    describe('Testing the PUT methods', function() {

        //Create Customer record as User 'user'. Then attempt to update (as 'user')
        it('Should be able to update an existing Customer',function(done){

            var updatedForename = 'Updated first name';
            var updatedSurname = 'Updated last name';

            customer.personalDetails.forename = updatedForename;
            customer.personalDetails.surname = updatedSurname;

            //authenticate first
            loginUser(done, function(done){

                //now attempt to create new Customer
                var req = agent.put('/customers/'+customer._id)
                    .set('Accept', 'application/json')
                    .send(customer)
                    .expect('Content-Type',/json/)
                    .end(function(err, res){
                        req.expect(200);
//                        console.log('[EEE] ' + JSON.stringify(res.body));
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.body.should.not.have.property('message','User is not logged in');
                        res.body.should.have.property('_id');
                        res.body.personalDetails.should.have.property('forename', updatedForename);
                        res.body.personalDetails.should.have.property('surname', updatedSurname);
                        done();
                    });
            });

        });

        //Create Customer record as User 'user'. Then attempt to update (as 'user2')
        //Would expect this operation to fail
        it('Should NOT be able to update an existing Customer as a different user',function(done) {

            var updatedForename = 'Updated first name';
            var updatedSurname = 'Updated last name';

            customer.personalDetails.forename = updatedForename;
            customer.personalDetails.surname = updatedSurname;
            console.log('[PRE] _id : ' + customer.user);

//            customer.user = user2._id;

            console.log('[POST] _id : ' + customer.user);

            //authenticate first
            loginUser2(done, function(done){

                    //now attempt to create new Customer
                var req = agent.put('/customers/'+customer._id)
                    .set('Content-Type', 'application/json')
                    .send(customer)
                    .end(function(err, res){
                        console.log('[EEE] returned response : ' + JSON.stringify(res.error ));
                        res.should.have.property('error');
                        res.error.should.have.property('status');
                        res.error.status.should.be.equal(403);

                        if(err) console.log('[errorZZZZ]: ' + JSON.stringify(err));

                        done();
                    });
            });

        });


    });



    //-----------------------------------
    //test the 'Customer' DELETE methods
    //-----------------------------------
    describe('Testing the DELETE methods', function() {
        it('Should be able to delete an existing Customer as the Original Author',function(done){

            loginUser(done, function(done){

                //now attempt to create new Customer
                var req = agent.delete('/customers/'+customer._id)
                    .end(function(err, res){
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.should.have.property('status', 200);

                        done();
                    });
            });

        });

        it('Should NOT be able to delete an existing Customer as a different Author',function(done){

            loginUser2(done, function(done){

                //now attempt to create new Customer
                var req = agent.delete('/customers/'+customer._id)
                    .end(function(err, res){
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.should.have.property('status', 403);

                        done();
                    });
            });

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

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
describe('[Server] Customer Controller Unit Tests:', function() {

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
            'addressDetails' : addressDetails,
            'user' : user
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

    });


    //-----------------------------------
    // Test the 'Customer' POST methods
    //-----------------------------------
    describe('Testing the POST methods', function() {
        it('Should be able to create a NEW Customer',function(done){

            var newCustomer = createCustomer('newCustomer_');

            //TODO: understand why the following line where we set the user field to point to an actual user instance
            //causes it to blow up with error message - CastError: Cast to ObjectId failed for value “[object Object]” at path “_id”
            //Yet when we switch it to the user._id value it works. The Customer schema expects the user field to be an _id and not an object
            //hence the cast exception. But what i don't understand is how it works when the app is deployed.
            //Update - investigated Articles code and fnd that the population of the user field is done client side, e.g.
            //exports.create = function(req, res) {
            //    var article = new Article(req.body);
            //    article.user = req.user;
            //This yeilds the following
                //[INVESTIGATE_001]a req.user : {"_id":"54cfc9b4fbb5305302d6bf34","displayName":"mo sayed","provider":"local","username":"masayed","__v":0,"created":"2015-02-02T19:02:12.215Z","roles":["user"],"email":"moo@cow.com","lastName":"sayed","firstName":"mo"}
            //[INVESTIGATE_001]b article.user : "54cfc9b4fbb5305302d6bf34"
            //Looks like the user field is cast from an object to an id by mongoose. Does this work for with populated code ?? Since this was the first instance we're creating the data in the db.
            //Whereas the populate case is slightly different since we populate on the way out of the db and then 'depopulate' on the way back in.
//            newCustomer.user = user;
            newCustomer.user = user._id;

            //Create a SuperTest request
            request(app).post('/customers/')
                .set('Accept', 'application/json')
                .send(newCustomer)
                .expect('Content-Type',/json/)
                .end(function(err, res){
//                    console.log('[NEW CUSTOMER] '+ JSON.stringify(res));
                    console.log('[NEW CUSTOMER] '+ res);
//                    res.body.should.have.property('_id');
                    done();
                });
        });
    });

    //-----------------------------------
    //test the 'Customer' PUT methods
    //-----------------------------------
    describe('Testing the PUT methods', function() {
        it('Should be able to update an existing Customer',function(done){
        });
    });



    //-----------------------------------
    //test the 'Customer' DELETE methods
    //-----------------------------------
    describe('Testing the DELETE methods', function() {
        it('Should be able to delete an existing Customer',function(done){
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

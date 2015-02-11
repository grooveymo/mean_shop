/**
 * Created by BruceWayne on 07/02/2015.
 */
/**
 * Created by BruceWayne on 30/01/2015.
 * Tests to be implemented (See customer.server.route.js)

 0. list Customers [GET] ** done ***
 1. create Customer [POST] ** done ***
 2. get Single Customer [GET] ** done ***
 3. update Customer [PUT] ** done ***
 4. delete Customer [DELETE] ** done ***


 5. Create Order [POST] ** done ***
 6. get All Orders [GET] ** done ***
 7. get Specific Order [GET] ** done ***
 8. update Order (PUT] ** done **
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

401 - unauthenticated
403 - unAuthorised

 */
// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app = require('../../server'),

//use this for methods NOT requiring authentication
    request = require('supertest'),

//use async
    async = require('async'),

//use this for methods requiring authentication
    agent = request.agent(app),

    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Customer = mongoose.model('Customer'),
    Item = mongoose.model('Item'),
    OrderItem = mongoose.model('OrderItem'),
    Order = mongoose.model('Order');


// Define global test variables
var user, customer, user2, item1, item2, item3, orderItem1, orderItem2, order, orderId;

//var cookie;

//set debug on mongoose
//mongoose.set('debug',true);

// Create an 'Articles' controller test suite

describe('[Server] Order Controller Unit Tests:', function() {

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
    }

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
    }

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

    var createItem1 = function(task) {

        item1 = new Item({
            name : 'trousers',
            description: 'something to cover the legs',
            price: 10,
            user : user._id
        });


        item1.save(function(err){
            if(err) console.log('[ERROR] saving item 1');
//            console.log('[beforeEach]1 saved 1st item');

        });

    };
    var createItem2 = function (task) {

        item2 = new Item({
            name : 'shirt',
            description: 'something to cover the chest',
            price: 20,
            user : user._id
        });

        item2.save(function(err){
            if(err) console.log('[ERROR] saving item 2');
//            console.log('[beforeEach]2 saved 2nd item');

        });


    };

    var createItem3 = function (task) {

        console.log('creating 3rd item');
        item3 = new Item({
            name : 'hat',
            description: 'something to cover the head',
            price: 30,
            user : user._id
        });

        item3.save(function(err){
            if(err) console.log('[ERROR] saving item 3');
//            console.log('saved 3rd item');
        });


    };

    var createOrderItem1 = function() {

        orderItem1 = new OrderItem({
            item : item1._id,
            quantity: 1
        });

        return orderItem1;
    };
    var createOrderItem2 = function() {

        orderItem2 = new OrderItem({
            item : item2._id,
            quantity: 2
        });

        return orderItem1;

    };

    var createOrder = function(done) {


        createOrderItem1();
        createOrderItem2();

        order = new Order({
            orderItems : [orderItem1, orderItem2],
            total: (orderItem1.quantity * orderItem1.item.price) + (orderItem2.quantity * orderItem2.item.price)
        });

//        console.log('created Order ');

        //Save order to customer
        customer.orders = [order];

        customer.save(function(err) {
            if (err) console.log('[SuperTest] error saving Customer with ORDER: ' + JSON.stringify(err));
            orderId = customer.orders[0]._id;
//            console.log('[beforeEach]3 Updated customer : ' + customer._id + ' with order: ' + JSON.stringify(customer.orders[0]._id));
//            console.log('Updated customer : ' + customer._id + ' with order: ' + JSON.stringify(customer.orders[0]));

            done();
        });

//        return order;

    };

    /**
     * Create another order to use in the POST tests
     * @returns {{orderItems: *[], total: number}}
     */
    var generateAnotherOrder = function() {

        var anotherOrderItem1 = {
            item : item1,
            quantity: 10
        };

        var anotherOrderItem2 = {
            item : item2,
            quantity: 10
        };

        var anotherOrder = {
            orderItems : [anotherOrderItem1, anotherOrderItem2],
            total: (orderItem1.quantity * orderItem1.item.price) + (orderItem2.quantity * orderItem2.item.price)
        };

        //console.log('creating another ordeR: ' + JSON.stringify(anotherOrder));
        return anotherOrder;
    };

    var generateOrder = function(done) {

 //       console.log('[beforeEach#generateOrder]....');
        var callback = null;
        async.series([
           createItem1(done),
           createItem2(done),
//           createItem3(callback),
           createOrder(done)


        ], function(err, results){
//            console.log('[generateOrder]....completed');
            done();

        });


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

//            console.log('[user] _id : ' + user._id);

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

            //customer is saved and returned with _id but is not populated
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
//            console.log('[user2] _id : ' + user2._id);
            done();
        });
    });

    beforeEach(function(done) {
        generateOrder(done);
    });


    xdescribe('Test that order can be created', function(){

        it('should demo that order can be persisted', function(done){

            Customer.findById(customer._id).populate('orders orders.orderItems orders.orderItems.item').exec(function(err, customer){

                if (err) {
                    console.log('error retrieving customer orders')
                }
                else {
                    var orders = customer.orders;
                    console.log('Customer has num orders: ' + orders.length);
                    console.log('Customer has following orders: ' + JSON.stringify(orders));
                    done();
                }


            });

        });
    });

    describe('Test GET operations', function(){

        it('Should NOT be able to get the list of Orders for a given Customer without logging in', function(done){
            request(app).get('/customers/'+customer._id+'/orders')
                .set('Accept','application/json')
            .end(function(err, res){
                if(err) console.log('[error]: ' + JSON.stringify(err));
                    res.body.should.have.property('message','User is not logged in');
                    res.status.should.equal(401);
                done();
            });
        });


        it('Should be able to get the list of Orders for a given Customer if logged in', function(done){

            //authenticate first
            loginUser(done, function(done){

                //now attempt to create new Customer
                var req = agent.get('/customers/'+customer._id+'/orders')
                    .set('Accept','application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res){
                        //the following does not appear to do anything
//                        req.expect(203);
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.status.should.equal(200);
                        res.body.should.not.have.property('message','User is not logged in');
                        res.body.should.be.an.Array.and.have.lengthOf(1);
                        res.body[0].should.have.property('_id');
                        res.body[0].should.have.property('orderItems');
                        res.body[0].should.have.property('status', 'NEW');

                        done();
                    });
            });

        });


        it('Should NOT be able to get the Specific Order for a given Customer without logging in', function(done){
//            console.log('testing url: '+ '/customers/'+customer._id+'/orders/'+orderId);
            request(app).get('/customers/'+customer._id+'/orders/'+orderId)
                .set('Accept','application/json')
                .end(function(err, res){
                    if(err) console.log('[error]: ' + JSON.stringify(err));
                    res.body.should.have.property('message','User is not logged in');
                    res.status.should.equal(401);
                    done();
                });
        });


        it('Should be able to get the Specific Order for a given Customer after logging in', function(done){
//            console.log('1. testing url: '+ '/customers/'+customer._id+'/orders/'+orderId);


            //authenticate first
            loginUser(done, function(done){

                //now attempt to create new Customer
                var req = agent.get('/customers/'+customer._id+'/orders/'+orderId)
                    .set('Accept','application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res){
                        //the following does not appear to do anything
//                        req.expect(203);
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.status.should.equal(200);
                        res.body.should.not.have.property('message','User is not logged in');
//                        res.body.should.not.be.an.Array;

//                        console.log('[res] ' + JSON.stringify(res.body));

                        var actualOrderId = res.body._id;
//                        console.log('[expected] ' + JSON.stringify(orderId));
//                        console.log('[result] ' + JSON.stringify(actualOrderId));

                        res.body.should.have.property('_id');
                        //NOTE: need to cast orderId as a string for equality test to pass
                        res.body.should.have.property('_id',orderId.toString());
                        res.body.should.have.property('orderItems');
                        res.body.should.have.property('status', 'NEW');

                        done();
                    });
            });

        });

    });

    /**
     * Test POST operations for OrderController
     */
    describe('Test POST operations', function(){

        it('Should Not be able to create a new Order if  NOT logged in', function(done){

            //create another order
            var anotherOrder = generateAnotherOrder();

            //attach it to a customer
            anotherOrder.customerId = customer._id;

            //now attempt to create new Customer
            var req = agent.post('/customers/' + customer._id + '/orders')
                .set('Accept', 'application/json')
                .send(anotherOrder)
                .expect('Content-Type',/json/)
                .end(function(err, res){
                    if(err) console.log('[error]: ' + JSON.stringify(err));
                    res.body.should.have.property('message','User is not logged in');
                    res.status.should.equal(401);

                    done();
                });
        });

        it('Should be able to create a new Order if Logged in', function(done){

            //create another order
            var anotherOrder = generateAnotherOrder();

            //attach it to a customer
            anotherOrder.customerId = customer._id;

            //authenticate first
            loginUser(done, function(done) {


                //now attempt to create new Order
                var req = agent.post('/customers/' + customer._id + '/orders')
                    .set('Accept', 'application/json')
                    .send(anotherOrder)
                    .expect('Content-Type',/json/)
                    .end(function(err, res){
                        req.expect(200);
                        if (err) console.log('[error]: ' + JSON.stringify(err));
//                        console.log('[End] res: ' + JSON.stringify(res.body));
                        res.body.should.not.have.property('message', 'User is not logged in');
                        res.body.orders.should.be.an.Array.and.have.lengthOf(2);
                        res.body.should.have.property('_id');
                        done();
                    });

            });

        });

    });


    /**
     * Test PUT Operations
     */
    describe('Test the PUT operations',function(){

        var targetCustomer;

        beforeEach(function(done){
//            console.log('a1] job marley');
            targetCustomer = Customer.findOne({_id:customer._id})
                .populate('orders orders.orderItems orders.orderItems.item').exec(

                function(err, customer){
                    if(err) console.log(err);
                    if(!customer) throw (new Error('failed to load order'));
//                    console.log('a2] populated customer has : ' + JSON.stringify(customer));
//                    console.log('a3] populated customer has : ' + JSON.stringify(customer.orders ));
                    targetCustomer = customer;
                    done();
                });


        });


        it('Should not allow an Order to be updated if the User is NOT logged in', function(done){

//            console.log('b1] populated customer has : ' + JSON.stringify(targetCustomer));

            //update an existing Order
            var existingOrder = targetCustomer.orders[0];

//            console.log('Existing Order : '+ JSON.stringify(existingOrder) );
            existingOrder.orderItems.forEach(function(orderItem){
                orderItem.quantity = 10;
            });
//            console.log('Modified Order : '+ JSON.stringify(existingOrder) );

            //construct the PUT request body
            var requestBody = {
                customerId: targetCustomer._id,
                orderId : existingOrder._id,
                order : existingOrder
            };


            ////now attempt to update an existing order
            var req = agent.put('/customers/' + targetCustomer._id + '/orders/'+existingOrder._id)
                .set('Content-Type','application/json')
                .send(requestBody)
                .end(function(err, res){
                    if(err) console.log('[error]: ' + JSON.stringify(err));
                    res.body.should.have.property('message','User is not logged in');
                    res.status.should.equal(401);

                    done();
                });
            //

        }); //it

        it('Should allow an Order to be updated if the User IS logged in', function(done){

            //update an existing Order
            var existingOrder = targetCustomer.orders[0];

//            console.log('a] Existing Order : '+ JSON.stringify(existingOrder) );
            existingOrder.orderItems.forEach(function(orderItem){
                orderItem.quantity = 10;
            });
//            console.log('a] Modified Order : '+ JSON.stringify(existingOrder) );

            //construct the PUT request body
            var requestBody = {
                customerId: targetCustomer._id,
                orderId : existingOrder._id,
                order : existingOrder
            };

            //authenticate first
            loginUser(done, function(done) {
                ////now attempt to update an existing order
                var req = agent.put('/customers/' + targetCustomer._id + '/orders/'+existingOrder._id)
                    .set('Content-Type','application/json')
                    .send(requestBody)
                    .end(function(err, res){
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.body.should.not.have.property('message','User is not logged in');
                        res.status.should.equal(200);
                        res.body._id.should.equal(targetCustomer._id.toString());

                        done();
                    });

            });

        }); //it

    });


    /**
     * Test DELETE operations
     *
     */

    describe('Test DELETE operations', function(){

        it('Should Not be able to delete Order if NOT logged on', function(done){

//            loginUser(done, function(done){

                //now attempt to delete an order for a given customer
                var req = agent.delete('/customers/'+customer._id+'/orders/'+orderId)
                    .end(function(err, res){
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.body.should.have.property('message','User is not logged in');
                        res.status.should.equal(401);
                        done();
                    });
//            });


        });

        it('Should Not be able to delete Order if logged on and NOT authorized', function(done){

            loginUser2(done, function(done){

                //now attempt to delete an order for a given customer
                var req = agent.delete('/customers/'+customer._id+'/orders/'+orderId)
                    .end(function(err, res){
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.status.should.equal(403);
                        done();
                    });
            });

        });

        it('Should be able to delete Order if logged on and authorized', function(done){

//            console.log('[DELETE]1 orders size = ' + customer.orders.length);
            customer.orders.length.should.equal(1);

            loginUser(done, function(done){

                //now attempt to delete an order for a given customer
                var req = agent.delete('/customers/'+customer._id+'/orders/'+orderId)
                    .end(function(err, res){
                        if(err) console.log('[error]: ' + JSON.stringify(err));
                        res.body.should.not.have.property('message','User is not logged in');
                        res.status.should.equal(200);

                        Customer.findById(customer._id, function(err, cust){
                            if(err) console.log('err: ' + JSON.stringify(err));
//                            console.log('[DELETE]2 orders size = ' + cust.orders.length);
                            cust.orders.length.should.equal(0);
                            done();
                        });
                   });
            });

        });


    });
/*
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

*/


    // Define a post-tests function
    afterEach(function(done) {
//        console.log('Running afterEach');
        // Clean the database
        Order.remove(function(){
//            console.log('[remove order]');
         OrderItem.remove(function(){
//             console.log('[remove orderItem]');
          Item.remove(function(){
//              console.log('[remove item]');
           Customer.remove(function() {
//               console.log('[remove customer]');

               User.remove(function() {
 //                  console.log('[remove user]');
 //                  console.log('afterEach completed');

                   done();
            });
           });
          });
         });
        });

    });


});

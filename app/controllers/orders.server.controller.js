/**
 * Created by BruceWayne on 10/01/2015.
 * Want to model
 *
 * 1. Create an Order [DONE]
 * 2. Retrieve Specific Order for a given Customer [DONE]
 * 3. Retrieve All Orders for a given Customer  [DONE]
 * 4. Update Specific Order for a given Customer [DONE]
 *   - NOTE:
 *    Ran into the 'depopulation' PROBLEM
 *    when updating we use findOne to retrieve the Order and use 'populate' to perform
 *    a 'join' and retrieve the associated items for each OrderItem. This will return
 *    a fully populated Order instance. However once we've made the necessary updates to
 *    this instance and we want to perform a mongo update, the update Order instance
 *    has a fully copy of the item object in the OrderItem instance. However the schema
 *    shows that the model expects just the item._id and not it's object equivalent.
 *    This means we have to turn
 *
 *  item =        {
          	    "_id" : ObjectId("54a2c4241571793c92c4ade7"),
                "user" : ObjectId("54a2c0f38ef6ebd18da8a244"),
                "price" : "3.45",
                "created" : ISODate("2014-12-30T15:26:28.377Z"),
                "description" : "mug",
                "name" : "mug",
                "__v" : 0
            }

    to

    item = "54a2c4241571793c92c4ade7"

 This can be achieved using a simple function (e.g. normalise() see below)
 to transform from the Object to it's ._id

 we can deploy this in 1 of 2 ways.

 option 1 - use mongoose middleware : preSave().
            However this limits you in the way you cna perform the update.
            Middleware functions such as preSave() are not available
            for update, findByIdandUpdate() etc since those operations
            are performed in the database and not the application
            and therefore offer no hooks.

 option 2 - manually code in the function before you call
            findByIdAndUpdate(), e.g.

            order.orderItems = normalise(order.orderItems) // changes from item object into item ._id

            Customer.findByIdAndUpdate(..., order);

 I've adopted option 2 since i wanted to retain the use of mongooses' update methods.

 further info here:
 - https://github.com/LearnBoost/mongoose/issues/964
 - https://github.com/LearnBoost/mongoose/issues/2509
 *
 * 5. Update All Orders for a given Customer [NICE TO HAVE]
 * 6. Update All Orders for All Customers [NICE TO HAVE]
 *
 * !!! 7. Delete Specific Order for a given Customer
 *
 * 8. Delete All Orders for a given Customer.  [NICE TO HAVE]
 *
 *
 *
 * Lessons Learned
 * 1. models that use populate - ensure that the UI has the fully populated model. Don't depopulate in the GUI.
 *    instead do it on the server. This means that all the model information is available for CREATE/UPDATE
 *    operations. I.e. we have a single currency (i.e. dto) that is used in the GUI. Only when we're
 *    saving/updating do we replace an referenced instance (e.g. item) by it's id ._id.
 *
 * 2. middleware methods e.g. pre, post save() not available to methods such as 'update', 'findByIdAndUpdate'
 *    So can't do depopulation() inside of the middleware but will have to explicitly call
 *    inside any create/update methods.
 *
 *    Model.update, findByIdAndUpdate, findOneAndUpdate, findOneAndRemove, findByIdAndRemove are all commands executed directly in the database.
 *
 * 3.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Customer = mongoose.model('Customer'),
    Order = mongoose.model('Order'),
    _ = require('lodash'),
    ObjectId = require('mongoose').Types.ObjectId;

var normalise = function(orderItemsArray){
    return orderItemsArray.map(function(orderItem){
        console.log('[Server]a normalised OrderItem: ' + JSON.stringify(orderItem));
        orderItem.item = orderItem.item._id;
        console.log('[Server]b normalised OrderItem: ' + JSON.stringify(orderItem));
        return orderItem;
    });
};

/**
 * Create a Order
 * Demo this in 2 ways
 *  a.) Option I - Save Changes
 *      1. Get Customer
 *      2. Update Customer.Orders array by pushing new Order
 *      3. Save Customer
 *
 *  b.) Option II - database update
 *      1. use findByIdAndUpdate()
 *
 *
 *  think option II is better to avoid concurrent issues.
 *  Assume that in case I, you and another party retrieve Customer,
 *  then each of you perform update. The last one will be performing update
 *  on stale version.
 */
exports.create = function(req, res) {

    console.log('[order.server.controller#create] > req.body: ' + JSON.stringify(req.body));

    //get customer id
    var customerId = req.body.customerId;
    console.log('[order.server.controller#create] passed customer id : ' + customerId);

    //Option I:
    //step1 : retrieve Customer
    //step2 : push new Order into Customers list of orders
    //step 3: persist customer
    //Customer.findById(customerId).exec(function(err, customer) {
    //
    //    if (! customer) throw (new Error('Failed to load Customer ' + customerId));
    //
    //    console.log('1.) located Customer: ' + JSON.stringify(customer));
    //    console.log('2.) Order in raw format: ' + JSON.stringify(req.body));
    //
    //    var order = req.body;
    //
    //    customer.orders.push(order);
    //
    //    customer.save(function(err) {
    //        if (err) {
    //            console.log('[ERROR] : ' + err);
    //            return res.status(400).send({
    //                message: errorHandler.getErrorMessage(err)
    //            });
    //        } else {
    //
    //            //test that order has bee saved correctly
    //            Customer.findById(customerId).populate('orders.orderItems.item').exec(function(err, cust){
    //                if (! customer) throw (new Error('Failed to load Customer ' + customerId));
    //
    //                console.log('Saved Customer: ' + JSON.stringify(cust) );
    //                res.jsonp(customer);
    //
    //            });
    //            //end test
    //        }
    //    });
    //});

    //Option 2:
    //step1 : Create new Order instance
    //step2: locate Customer and perform update.
    //used findByIdAndUpdate()

    //extract the order object - used to update the Customer.orders array
    var order = req.body;

    console.log('[order.server.controller#create Order :' + JSON.stringify(order));

    //var x = normalise(order.orderItems);
    //console.log('[Server] Normalised Order  :' + JSON.stringify(x));
    var orderItems = normalise(order.orderItems);
    order.orderItems = orderItems;
    console.log('[Server] Normalised Order  :' + JSON.stringify(order));

    /**
     * @params customerId - the customer id
     * @params order - use $push to insert a new order into the Customers array of orders
     * safe - Use Mongo's Write Concerns to force it to write the data to disk (ensures no data lost)
     * upsert - perform insert if update not possible which is the case here although seems to work without this config
     */
    Customer.findByIdAndUpdate(customerId, {$push : {orders:order}},{safe:true, upsert:true}, function(err, updatedCustomer){

        if (! updatedCustomer) throw (new Error('Failed to load Customer ' + customerId));

        console.log('updated Customer : ' + JSON.stringify(updatedCustomer));

        res.jsonp(updatedCustomer);
    });


};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
    console.log('Arrived at the server..');
    console.log('req.params: ' + JSON.stringify(req.params));
    console.log('req.body: ' + JSON.stringify(req.body));

    //option 2- find Order by Combination of Customer and Order id and then use projection to only return required Order
    //This uses the $ positional operator and will return the Customer object (minimally populated?) with only the
    //matching order.
    Customer.find({_id:req.params.customerId,  orders :{$elemMatch:{_id:req.params.orderId}}},{'orders.$':1})
        //do we need orders/order.orderItems. We only use references from Item model so maybe just declare this in the populate mehtod.
        .populate('orders orders.orderItems orders.orderItems.item').exec(

        function(err, customer){
            if(err) console.log(err);
            if(!customer) throw (new Error('failed to load order'));
            console.log('[XXX] retrieved Order: ' + JSON.stringify(customer));
            res.jsonp(customer[0].orders[0]);
        });


    ////option 1 - find customer, project only matching order and then use populate to pull it back
    ////This will return a Customer instance with the orders array containing a single element,
    //// i.e. our required order instance
    //Customer.find({'_id':req.params.customerId}, //query parameter
    //    {
    //        //will only return 1st matching element of orders array
    //        orders:{$elemMatch:{_id:req.params.orderId}}
    //    }) // projection parameter
    //    //do we need orders/order.orderItems. We only use references from Item model so maybe just declare this in the populate mehtod.
    //        .populate('orders orders.orderItems orders.orderItems.item').exec(
    //
    //            function(err, customer){
    //                if(err) console.log(err);
    //                if(!customer) throw (new Error('failed to load order'));
    //                console.log('retrieved customer: ' + JSON.stringify(customer));
    //            res.jsonp(customer[0].orders[0]);
    //    });
    //

};

/**
 * Update an Order
 */
/*
Original
[Server] update body  :{
                        "customerId":"54b8ead1dd050becddbc6360",
                        "orderId":"54b8eae3dd050becddbc6361",
                        "orderItems": [
                                        {"item":{"_id":"54a2c62c02a7171e98115b33",
                                                 "user":"54a2c0f38ef6ebd18da8a244",
                                                 "price":9999,
                                                 "__v":0,
                                                 "created":"2014-12-30T15:35:08.222Z",
                                                 "description":"Board game",
                                                 "name":"Monopoly"},
                                         "quantity":2,
                                         "_id":"54b8eae3dd050becddbc6362"
                                        }
                                       ],
                        "total":null}

in db it looks like

 "orders" : [
              {
                "total" : 49995,
                "_id" : ObjectId("54b8eae3dd050becddbc6361"),
                "status" : "NEW",
                "dateSubmitted" : ISODate("2015-01-16T10:41:39.505Z"),
                "orderItems" : [
                                 {
                                  "item" : ObjectId("54a2c62c02a7171e98115b33"),
                                  "quantity" : 5,
                                  "_id" : ObjectId("54b8eae3dd050becddbc6362")
                                }
                             ]
               }
            ]
*/

/* version 1 - note that this looks different from what's stored in db since we call populate when we pull the data to display in view
hence why the 'item' entry looks dfferent from the one above.
* [Server] update body  :
* {"customerId":"54b8ead1dd050becddbc6360",
* "orderId":"54b8eae3dd050becddbc6361",
* "order":{
*              "total":39996,
*              "_id":"54b8eae3dd050becddbc6361",
*              "status":"NEW",
*              "dateSubmitted":"2015-01-16T10:41:39.505Z",
*              "orderItems": [ {"item":{"_id":"54a2c62c02a7171e98115b33",
*                                       "user":"54a2c0f38ef6ebd18da8a244",
*                                       "price":9999,
*                                       "__v":0,
*                                       "created":"2014-12-30T15:35:08.222Z",
*                                       "description":"Board game",
*                                       "name":"Monopoly"},
*                               "quantity":4,
*                               "_id":"54b8eae3dd050becddbc6362"
*                              }
*                           ]
*         }
* }

 * */

exports.update = function(req, res) {
//    console.log('[Server] update body  :' + JSON.stringify(req.body));

    mongoose.set('debug', true);

    var updatedOrder = req.body.order;

    console.log('[Server] update Order  :' + JSON.stringify(updatedOrder));

    var orderItems = normalise(updatedOrder.orderItems);
    updatedOrder.orderItems = orderItems;
    console.log('[Server] Normalised Order  :' + JSON.stringify(updatedOrder));


//    Customer.update({_id:req.body.customerId,  orders :{$elemMatch:{_id:req.body.orderId}}},{'orders.$':1})
    Customer.update({_id:req.body.customerId,  orders :{$elemMatch:{_id:req.body.orderId}}},{$set:{'orders.$':updatedOrder} },

        function(err, customer){
            if(err) console.log(err);
            if(!customer) throw (new Error('failed to load order'));
            console.log('[XXX] updated Order: ' + JSON.stringify(customer));
//            res.jsonp(customer[0].orders[0]);
//            res.jsonp(customer[0]);
            res.jsonp({_id: req.body.customerId});

        });


};



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

exports.delete = function(req, res) {

    //HTTP DELETE expects ids to be passed in the request url (ie. request params)
    //see https://github.com/angular/angular.js/issues/3207
    console.log('[Server] delete body  :' + JSON.stringify(req.body));
    console.log('[Server] delete params  :' + JSON.stringify(req.params));
    var customerId = req.params.customerId;
    var orderId = req.params.orderId;

    mongoose.set('debug', true);

    Customer.findByIdAndUpdate(customerId, {$pull : {orders : {_id:new ObjectId(orderId)} }}, function(err, updatedCustomer){

        if(err) console.log('error deleteing alien: ' + JSON.stringify(err));
        if (! updatedCustomer) throw (new Error('Failed to load Customer ' + customerId));

        console.log('updated Customer orders : ' + JSON.stringify(updatedCustomer.orders));

        res.jsonp(updatedCustomer);
    });

};

/**
 * List of Orders for a Customer
 */
exports.list = function(req, res) {

    //it's a GET and not POST, so customerId is supplied as a request params.
    //compare to the POST in the create() method which gets hold of the customerId
    //via req.body.customerId since the data passed in POST is in the body.

    var customerId = req.params.customerId;

    console.log('[list] passed customer id : ' + customerId);

    //do we need orders/order.orderItems. We only use references from Item model so maybe just declare this in the populate mehtod.
    Customer.findById(customerId).populate('orders orders.orderItems orders.orderItems.item').exec(function(err, customer){

        if (err) {
            return res.status(400).send({
                                            message: errorHandler.getErrorMessage(err)
                                        });
        }
        else {
            var orders = customer.orders;
            console.log('Customer has num orders: ' + orders.length);
            console.log('Customer has following orders: ' + JSON.stringify(orders));
            res.jsonp(orders);
        }


    });


};


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

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var customers = require('../../app/controllers/customers');
	var orders = require('../../app/controllers/orders');

	// Customers Routes
	app.route('/customers')
		.get(customers.list)
        //TODO: disabled requiresLogin to enable SuperTest test to createnew customer to pass
        //Need to find out how to test using SuperTest when the user needs to be logged in
        // see 1. https://github.com/jaredhanson/passport/issues/86
        //     2. https://github.com/jaredhanson/passport/issues/132
		.post(users.requiresLogin, customers.create);

	app.route('/customers/:customerId')
		.get(customers.read)
		.put(users.requiresLogin, customers.hasAuthorization, customers.update)
		.delete(users.requiresLogin, customers.hasAuthorization, customers.delete);

	//---------------- start: Orders Routes -----------
	app.route('/customers/:customerId/orders')
		.post(users.requiresLogin, orders.create) //This url will be serviced by the method #create() inside the orders.server.controller
		.get(users.requiresLogin, orders.list);

	app.route('/customers/:customerId/orders/:orderId')
		.get(users.requiresLogin, orders.read)
		.put(users.requiresLogin,orders.update)
		.delete(users.requiresLogin, customers.hasAuthorization, orders.delete);
//PUT /customers/54b8ead1dd050becddbc6360/orders/54b8eae3dd050becddbc6361

	//---------------- end: Orders Routes -----------

	// Finish by binding the Customer middleware
	app.param('customerId', customers.customerByID);
};

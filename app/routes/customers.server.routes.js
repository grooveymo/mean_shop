'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var customers = require('../../app/controllers/customers');
	var orders = require('../../app/controllers/orders');

	// Customers Routes
	app.route('/customers')
		.get(customers.list)
		.post(users.requiresLogin, customers.create);

	app.route('/customers/:customerId')
		.get(customers.read)
		.put(users.requiresLogin, customers.hasAuthorization, customers.update)
		.delete(users.requiresLogin, customers.hasAuthorization, customers.delete);

	//---------------- insert -----------
	app.route('/customers/:customerId/orders')
		.post(users.requiresLogin, orders.create) //This url will be serviced by the method #create() inside the orders.server.controller
		.get(users.requiresLogin, orders.list);

	app.route('/customers/:customerId/orders/:orderId')
		.get(users.requiresLogin, orders.read)
		.put(users.requiresLogin,orders.update)
		.delete(users.requiresLogin, customers.hasAuthorization, orders.delete);
//PUT /customers/54b8ead1dd050becddbc6360/orders/54b8eae3dd050becddbc6361

	//---------------- insert -----------

	// Finish by binding the Customer middleware
	app.param('customerId', customers.customerByID);
};

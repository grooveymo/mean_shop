'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var items = require('../../app/controllers/items');

	// Items Routes
	app.route('/items')
		.get(items.list)
		.post(users.requiresLogin, items.create);

	app.route('/items/:itemId')
		.get(items.read)
		.put(users.requiresLogin, items.hasAuthorization, items.update)
		.delete(users.requiresLogin, items.hasAuthorization, items.delete);

	// Finish by binding the Item middleware
	app.param('itemId', items.itemByID);
};
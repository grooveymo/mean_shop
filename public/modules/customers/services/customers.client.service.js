'use strict';

//Customers service used to communicate Customers REST endpoints
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers/:customerId', { customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
	//New $resource for Orders
.factory('Orders', ['$resource',
	function($resource) {
		return $resource('customers/:customerId/orders/:orderId',
			{ customerId: '@customerId',
			  orderId : '@orderId'
			}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

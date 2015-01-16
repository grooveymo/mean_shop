'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers',
	function($scope, $stateParams, $location, Authentication, Customers ) {
		$scope.authentication = Authentication;

		// Create new Customer
		$scope.create = function() {
			var personalDetails = {forename:''};
			// Create new Customer object
			var customer = new Customers ({
//				name: this.name
				personalDetails : {
					forename : this.forename,
					surname : this.surname,
					dob : this.dob
								  },
				addressDetails : {
					firstLine : this.firstLine,
					city : this.city,
					postCode : this.postCode
				},
				phoneDetails : {
					office : this.office,
					home : this.home,
					mobile : this.mobile
				}
			});

			// Redirect after save
			customer.$save(function(response) {
				$location.path('customers/' + response._id);

				// Clear form fields
				$scope.forename = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Customer
		$scope.remove = function( customer ) {
			if ( customer ) { customer.$remove();

				for (var i in $scope.customers ) {
					if ($scope.customers [i] === customer ) {
						$scope.customers.splice(i, 1);
					}
				}
			} else {
				$scope.customer.$remove(function() {
					$location.path('customers');
				});
			}
		};

		// Update existing Customer
		$scope.update = function() {
			var customer = $scope.customer ;

			customer.$update(function() {
				$location.path('customers/' + customer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Customers
		$scope.find = function() {
			$scope.customers = Customers.query();
		};

		// Find existing Customer
		$scope.findOne = function() {
			$scope.customer = Customers.get({ 
				customerId: $stateParams.customerId
			});
		};
	}
]);
//=========================================================================
// Customers controller
angular.module('customers').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', 'Items', 'Orders',
	function($scope, $stateParams, $location, Authentication, Customers, Items, Orders ) {
		$scope.authentication = Authentication;

		$scope.orderItems = [];

		/**
		 * Find all items that can be purchased. display this in the view
		 * and user can make selections using addORderItem/removeOrderItem
		 */
		$scope.findAllItems = function() {
			console.log('{create order1 : customer = ' + $stateParams.customerId);

			$scope.customer = Customers.get({
				customerId : $stateParams.customerId
			}, function(){
				console.log('{create order2 : customer = ' + $stateParams.customerId);
				$scope.items = Items.query();
				console.log('{create order : items = ' + JSON.stringify($scope.items));
			});

		};


		/**
		 * called by add OrderItem button in view
		 * @param selectedItem The item selected by the user to be added to the cart
		 */
		$scope.addOrderItem = function(selectedItem) {

			//var jsObjects = [{a: 1, b: 2}, {a: 3, b: 4}, {a: 5, b: 6}, {a: 7, b: 8}];
			//var result = jsObjects.filter(function( obj ) {
			//	return obj.b === 6;
			//});
			//console.log('TEST: res = ' + JSON.stringify(result));

			if(!Array.prototype.filter) {
				console.log('WARNING:::: filter not supported');
			}
			//find element in array that matches the 'selectedItem'
			var orderItem = $scope.orderItems.filter(function(obj){
//				return obj.itemId === selectedItem._id;
//				return obj._id === selectedItem._id;
				return obj.item === selectedItem._id;
			});

			console.log(' found item : ' + JSON.stringify(orderItem));
			if(orderItem[0]) {
				console.log('found item will increment quantity');
				orderItem[0].quantity += 1;
			} else {
//				var newOrderItem = { itemId: this.item._id, name: this.item.name, price : this.item.price, quantity : 1 };
//				var newOrderItem = { _id: this.item._id, price : this.item.price, quantity : 1 };
				var newOrderItem = { item: this.item._id, price : this.item.price, quantity : 1 };
				$scope.orderItems.push(newOrderItem);
			}

			console.log('selected Items : ' + JSON.stringify($scope.orderItems));
		};


		/**
		 * called by remove OrderItem button in view
		 * @param selectedOrderItem The item the user wants to remove from the order.
		 */
		$scope.removeOrderItem = function(selectedOrderItem) {

			if(!Array.prototype.filter) {
				console.log('WARNING:::: filter not supported');
			}
			//find element in array that needs to be removed
			var orderItem = $scope.orderItems.filter(function(obj){
				return obj.id === selectedOrderItem.id;
			});

			console.log(' selected item : ' + JSON.stringify(selectedOrderItem));
			console.log(' found item : ' + JSON.stringify(orderItem));
			if(orderItem[0]) {
				console.log('found item will decrement quantity');
				orderItem[0].quantity -= 1;
				if(orderItem[0].quantity <= 0){
					console.log('will remove OrderItem');
					var index = $scope.orderItems.indexOf(orderItem[0]);
					$scope.orderItems.splice(index,1);
				}
			}
			console.log('selected Items : ' + JSON.stringify($scope.orderItems));

		};


		// Create new Order
		$scope.create = function() {

			console.log('XXXX');
			if($scope.orderItems.length > 0) {
				//use $resource to create Order for Customer

				var total = 0.0;
				$scope.orderItems.forEach(function(entry){
					total += (entry.price * entry.quantity);
				});

				//var order = {orderItems : $scope.orderItems, orderTotal : total};
                //
				//console.log('Will create an Order for : ' + JSON.stringify(order));
				console.log('about to persist new Order');

				var persistedOrder = new Orders({
					customerId: $stateParams.customerId, orderItems : $scope.orderItems, total : total
				});

				persistedOrder.$save(function(response) {
					$location.path('customers/' + response._id);
					console.log('successfully persisted order..');
					// Clear form fields
//					$scope.forename = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
		};

		// Remove existing Order
		$scope.remove = function( customer ) {
			//if ( customer ) { customer.$remove();
            //
			//	for (var i in $scope.customers ) {
			//		if ($scope.customers [i] === customer ) {
			//			$scope.customers.splice(i, 1);
			//		}
			//	}
			//} else {
			//	$scope.customer.$remove(function() {
			//		$location.path('customers');
			//	});
			//}
		};

		// Update existing Order
		$scope.update = function() {
			//var customer = $scope.customer ;
            //
			//customer.$update(function() {
			//	$location.path('customers/' + customer._id);
			//}, function(errorResponse) {
			//	$scope.error = errorResponse.data.message;
			//});
		};

		// Find a list of Orders
		$scope.find = function() {
			//$scope.customers = Customers.query();
			$scope.orders = Orders.query({customerId:$stateParams.customerId}, function(err, data){
				console.log('retrieved orders for customer: ' + $stateParams.customerId);
				console.log('results: ' + JSON.stringify(data));
			});
		};

		// Find existing Order
		$scope.findOne = function() {
			//$scope.customer = Customers.get({
			//	customerId: $stateParams.customerId
			//});
		};
	}
]);

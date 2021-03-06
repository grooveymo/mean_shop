'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers',
	function($scope, $stateParams, $location, Authentication, Customers ) {
		$scope.authentication = Authentication;

		// Create new Customer
		$scope.create = function() {
//			var personalDetails = {forename:'', surname :'', dob: ''};

			// Create new Customer object
			var customer = new Customers ({
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
                $scope.surname = '';
                $scope.dob = '';
                $scope.firstLine = '';
                $scope.city = '';
                $scope.postCode = '';
                $scope.home = '';
                $scope.office = '';
                $scope.mobile = '';


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

        //used when creating an order
        $scope.orderItems = [];

		console.log('[OrdersController#init] orderId = ' + $stateParams.orderId);
        //The following code block is a cludge. The call to the restful service for orders will be duplicated when
        //when the findOne() [i.e. when editing order] is called.
        //if($stateParams.orderId) { // this kicks in when we land on the edit-order.client.view.html page
        //var customerId = $stateParams.customerId;
        //
        ////retrieve order items
        //var orderId = $stateParams.orderId;
        //
        //console.log('[OrderController#init]....customer: ' + customerId + ' order: ' + orderId);
        //
        ////generates following http request
        ////http://localhost:3000/customers/54b8ead1dd050becddbc6360/orders/54b8eae3dd050becddbc6361
        //
        //$scope.order = Orders.get({customerId:customerId, orderId:orderId}, function(err){
        //	console.log('[OrdersController#init] retrieved order: ' + JSON.stringify($scope.order));
        //	$scope.orderItems = $scope.order.orderItems;
        //});
        //
        //} else { // this kicks in when we land on any other page ie. create-order.client.view.html
        //$scope.orderItems = [];
        //}

        /**
         * Performs initialisation for edit-order page. This involves:
         * 1. retrieving all items in db
         * 2. retrieving specific order to be edited.
         *
         */
        $scope.initForEditOrder = function() {
            $scope.customerId = $stateParams.customerId;
            $scope.orderId = $stateParams.orderId;

            //1. retrieve all items
            $scope.items = Items.query(function(err, items){

                //2. retrieve specific customer order
                $scope.order = Orders.get({customerId:$scope.customerId, orderId:$scope.orderId}, function(err){
                    console.log('retrived order: ' + JSON.stringify($scope.order));
                    $scope.orderItems = $scope.order.orderItems;
                });
            });

        };

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

			if(!Array.prototype.filter) {
				console.log('WARNING:::: filter not supported');
			}
			//find element in array that matches the 'selectedItem'
			var orderItem = $scope.orderItems.filter(function(obj){
				return obj.item._id === selectedItem._id;
			});

			console.log(' [DDT] found item : ' + JSON.stringify(orderItem));
			if(orderItem[0]) {
				console.log('found item will increment quantity');
				orderItem[0].quantity += 1;
			} else {
                //Originally refered to selected item using this.item since this function fires
                //when the addItem button is clicked next to an item. The view uses ng-repeat
                //and iterates over all items. We can use this.item to refer to any element
                // in the loop ng-repeat='item in items'.
                // However the jasmine test is run outside of this context and so won't
                //have a this.item defined. So have to switch to using the item instance passed
                //in as an argument to this method.
//				var newOrderItem = { item: this.item, quantity : 1 };
                var newOrderItem = { item: selectedItem, quantity : 1 };
				$scope.orderItems.push(newOrderItem);
                console.log('[DDT] adding new orderItem: ' + JSON.stringify(newOrderItem));
			}

			console.log('[CCC] selected Items : ' + JSON.stringify($scope.orderItems));
		};


		/**
		 * called by remove OrderItem button in view
		 * @param selectedOrderItem The item the user wants to remove from the order.
		 */
		$scope.removeOrderItem = function(selectedOrderItem) {

            console.log('[€removeOrderItem: ' + JSON.stringify(selectedOrderItem));
			if(!Array.prototype.filter) {
				console.log('WARNING:::: filter not supported');
			}
			//find element in array that needs to be removed
			var orderItem = $scope.orderItems.filter(function(obj){
				return obj.item._id === selectedOrderItem.item._id;
			});

			console.log('[X] selected item : ' + JSON.stringify(selectedOrderItem));
			console.log('[Y] found item : ' + JSON.stringify(orderItem));

			if(orderItem[0]) {
				console.log('found item will decrement quantity');
				orderItem[0].quantity -= 1;
				if(orderItem[0].quantity <= 0){
					console.log('will remove OrderItem');
					var index = $scope.orderItems.indexOf(orderItem[0]);
					$scope.orderItems.splice(index,1);
				}
			}
            else {
                throw Error('Attempted to remove an item that is not in the basket');
            }
			console.log('selected Items : ' + JSON.stringify($scope.orderItems));

		};


		// Create new Order
		$scope.create = function() {

			console.log('XXXX');
			if($scope.orderItems.length > 0) {
				//use $resource to create Order for Customer

				$scope.total = 0.0;
				$scope.orderItems.forEach(function(entry){
					$scope.total += (entry.item.price * entry.quantity);
                    console.log('[JAMMIN] name: ' + entry.item.name + ' price: ' + entry.item.price + ' quantity: ' + entry.quantity);
				});

				//var order = {orderItems : $scope.orderItems, orderTotal : total};
                //
				//console.log('Will create an Order for : ' + JSON.stringify(order));
				console.log('about to persist new Order');

				var persistedOrder = new Orders({
					customerId: $stateParams.customerId, orderItems : $scope.orderItems, total : $scope.total
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
		$scope.remove = function( orderId) {
			console.log('about to delete - ' + orderId);
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
				Orders.remove({customerId : $stateParams.customerId, orderId:orderId}, function(err) {
					if(err) console.log('Error experienced deleting orderId: ' + JSON.stringify(err));
					$location.path('/customers/'+$stateParams.customerId);
				});
		};

		/**
		 * Update existing Order
		 * Note that this is called from the edit-order.view.html page where
		 * the findOne has already been called and so $scope.order is correctly
		 * populated with the updated order.
		 */
		$scope.update = function() {

			console.log('[$scope.update()] Updating order - ' + JSON.stringify($scope.order) );

			if($scope.order) {

				var total = 0.0;
				$scope.order.orderItems.forEach(function(entry){
					total += (entry.item.price * entry.quantity);

					//TODO : perform depopluation() at the server and not the client
					//replace item definition with just the item._id. The schema defines item to be of type ObjectId
					//however when we pulled the Customer object from the database, we used 'populate' to repopulate
					//with the item object. So change item value to it's id.
					console.log('[A] item: ' + entry.item);
					console.log('[B] item: ' + entry.item._id);
//					entry.item = entry.item._id;
				});

				console.log('about to persist updated Order');

				$scope.order.total = total;
				$scope.persistedOrder = new Orders({
					customerId: $stateParams.customerId, orderId : $stateParams.orderId, order : $scope.order
				});

				$scope.persistedOrder.$update(function(response) {
					console.log('successfully updated order..Now navigateing to /customers/' + response._id);

					$location.path('customers/' + response._id);
					// Clear form fields
//					$scope.forename = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

			}
		};

		// Find ALL Orders for a given Customer
		$scope.find = function() {

			console.log('OrderController#find()....');
			$scope.customerId= $stateParams.customerId;

			////first get Customer - will need to display some info about customer
			//$scope.customer = Customers.get({
			//	customerId: $stateParams.customerId
			//}, function(err){

				//now query for orders
//				$scope.orders = Orders.query({customerId:$stateParams.customerId}, function(err, data){
            $scope.orders = Orders.query({customerId:$scope.customerId}, function(err, data){
					console.log('retrieved orders for customer: ' + $stateParams.customerId);
					console.log('results: ' + JSON.stringify(data));
				});

			//});

			//$scope.orders = Orders.query({customerId:$stateParams.customerId}, function(err, data){
			//	console.log('retrieved orders for customer: ' + $stateParams.customerId);
			//	console.log('results: ' + JSON.stringify(data));
			//});
		};

		// Find SINGLE Order for a given customer
		$scope.findOne = function() {
            $scope.customerId = $stateParams.customerId;
			$scope.orderId = $stateParams.orderId;

			console.log('OrderController#findOne()....customer: ' + $scope.customerId + ' order: ' + $scope.orderId);

			//generates following http request
			//http://localhost:3000/customers/54b8ead1dd050becddbc6360/orders/54b8eae3dd050becddbc6361

			$scope.order = Orders.get({customerId:$scope.customerId, orderId:$scope.orderId}, function(err){
				console.log('retrived order: ' + JSON.stringify($scope.order));
                $scope.orderItems = $scope.order.orderItems;
			});

		};
	}
]);

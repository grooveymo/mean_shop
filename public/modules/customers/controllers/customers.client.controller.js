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

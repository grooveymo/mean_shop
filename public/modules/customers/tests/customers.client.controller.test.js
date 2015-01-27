'use strict';
/**
 * Notes
 *
 * found instructions @ http://www.youtube.com/watch?v=oyWW_V4wALs on how to run debugger on karma tests in web storm
 * Right click karma.config.js and select debug option
 *
 * On first attempt it mentions that i need to install a chrome plugin (JetBrains IDE support) which I did.
 * had a problem running karma initially since it references ./config/config.js which has the following line
 *
 module.exports = _.extend(
 require('./env/all'),
 >>>>>> require('./env/' + process.env.NODE_ENV) || {}   <<<<<<
 );

process.env.NODE_ENV appears to be undefined even if i set it in the .bashrc file.
 So short term fix is to replace the line with

 module.exports = _.extend(
 require('./env/all'),
>>>>>>> require('./env/test') || {} <<<<<<
 );

 Not sure if i have to switch back if I'm developing and not testing.

 */
(function() {
	// Customers Controller Spec
	describe('Customers Controller Tests', function() {
		// Initialize global variables
		var CustomersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Customers controller.
			CustomersController = $controller('CustomersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Customer object fetched from XHR', inject(function(Customers) {
            console.log('running jasmine test for Customer: $scope.find()');
			// Create sample Customer using the Customers service
			var sampleCustomer = new Customers({
				name: 'New Customer'
			});

			// Create a sample Customers array that includes the new Customer
			var sampleCustomers = [sampleCustomer];

			// Set GET response
			$httpBackend.expectGET('customers').respond(sampleCustomers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customers).toEqualData(sampleCustomers);
		}));

		it('$scope.findOne() should create an array with one Customer object fetched from XHR using a customerId URL parameter', inject(function(Customers) {
            console.log('running jasmine test for Customer: $scope.findOne()');

            // Define a sample Customer object
			var sampleCustomer = new Customers({
				name: 'New Customer'
			});

			// Set the URL parameter
			$stateParams.customerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/customers\/([0-9a-fA-F]{24})$/).respond(sampleCustomer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.customer).toEqualData(sampleCustomer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Customers) {
            console.log('running jasmine test for Customer: $scope.create()');

            // Create a sample Customer object - this represents the JSON structure forming the body of the POST request we'll be constructing using the $resource service.
			var sampleCustomerPostData = new Customers({
                personalDetails : {
                    forename : 'firstname',
                    surname : 'lastname',
                    dob : '11/12/13'
                },
                addressDetails : {
                    firstLine : 'firstLine',
                    city : 'city',
                    postCode : 'postcode'
                },
                phoneDetails : {
                    home : '2134567',
                    office : '7654321',
                    mobile: '079323423'
                }
			});


            // Create a sample Customer response - This represents the JSON structure we expect returned as a response from the POST request.
			var sampleCustomerResponse = new Customers({
				_id: '525cf20451979dea2c000001',
//				name: 'New Customer'
                personalDetails : {
                    forename : 'firstname',
                    surname : 'lastname',
                    dob : '11/12/13'
                },
                addressDetails : {
                    firstLine : 'firstLine',
                    city : 'city',
                    postCode : 'postcode'
                },
                phoneDetails : {
                    home : '2134567',
                    office : '7654321',
                    mobile: '079323423'
                }

            });


            // Fixture mock form input values - here we set the values entered into a mock form. This will be used to construct the JSON structure forming the body of the POST request by the controller
			scope.name = 'New Customer';
            scope.forename = sampleCustomerPostData.personalDetails.forename;
            scope.surname = sampleCustomerPostData.personalDetails.surname;
            scope.dob = sampleCustomerPostData.personalDetails.dob;
            scope.firstLine = sampleCustomerPostData.addressDetails.firstLine;
            scope.city = sampleCustomerPostData.addressDetails.city;
            scope.postCode = sampleCustomerPostData.addressDetails.postCode;
            scope.home = sampleCustomerPostData.phoneDetails.home;
            scope.office = sampleCustomerPostData.phoneDetails.office;
            scope.mobile = sampleCustomerPostData.phoneDetails.mobile;


			// Set POST response
			$httpBackend.expectPOST('customers', sampleCustomerPostData).respond(sampleCustomerResponse);

            console.log('@@@@@@@ httpbackend returns: ' + JSON.stringify(sampleCustomerResponse));

            // Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.forename).toEqual('');
            expect(scope.surname).toEqual('');
            expect(scope.dob).toEqual('');
            expect(scope.firstLine).toEqual('');
            expect(scope.city).toEqual('');
            expect(scope.postCode).toEqual('');
            expect(scope.home).toEqual('');
            expect(scope.office).toEqual('');
            expect(scope.mobile).toEqual('');

			// Test URL redirection after the Customer was created
			expect($location.path()).toBe('/customers/' + sampleCustomerResponse._id);
		}));

		it('$scope.update() should update a valid Customer', inject(function(Customers) {

            console.log('running jasmine test for Customer: $scope.update()');

            // Define a sample Customer put data
			var sampleCustomerPutData = new Customers({
				_id: '525cf20451979dea2c000001',
				name: 'New Customer'
			});

			// Mock Customer in scope
			scope.customer = sampleCustomerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/customers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/customers/' + sampleCustomerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid customerId and remove the Customer from the scope', inject(function(Customers) {

            console.log('running jasmine test for Customer: $scope.remove()');

            // Create new Customer object
			var sampleCustomer = new Customers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Customers array and include the Customer
			scope.customers = [sampleCustomer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/customers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCustomer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.customers.length).toBe(0);
		}));

	});
    //============================================================================================================
    // Orders Controller Spec
    //============================================================================================================
    describe('Orders Controller Tests', function() {
        // Initialize global variables
        var //CustomersController,
            OrdersController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Customers controller.
            //CustomersController = $controller('CustomersController', {
            //    $scope: scope
            //});
            OrdersController = $controller('OrdersController', {
                $scope: scope
            });

        }));

        afterEach(function(){
            console.log('FINISHED TEST %%%%%%%%%%%%%%%');
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        /**
         * This tests the find() method which returns all orders for a given customer (with customerId)
         */
        it('$scope.find() should create an array with at least one Order object fetched from XHR', inject(function(Orders) {

            console.log('running jasmine test for Order: $scope.find()');

            //create sample customerId
            var customerId = '999cf20451979dea2c000001';

            //populate $stateParams
            $stateParams.customerId = customerId;

            // Create sample Customer using the Customers service
            var sampleOrder = new Orders({
                total:12.5,
                orderItems :[{item:'525cf20451979dea2c000001', quantity:2}]
            });

            // Create a sample Customers array that includes the new Customer
            var sampleOrders = [sampleOrder];

            // Set GET response
            $httpBackend.expectGET('customers/'+customerId+'/orders').respond(sampleOrders);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.orders).toEqualData(sampleOrders);
            expect(scope.customerId).toEqualData(customerId);

        }));

        it('$scope.findOne() should return a specific order for a given customer', inject(function(Orders){

            console.log('running jasmine test for Order: $scope.findOne()');

            //create sample customerId
            var customerId = '999cf20451979dea2c000001';
            var orderId = '222cf20451979dea2c000001';

            //populate $stateParams
            $stateParams.customerId = customerId;
            $stateParams.orderId = orderId;

            // Create sample Customer using the Customers service
            var sampleOrderItems = [{item:'525cf20451979dea2c000001', quantity:2}];

            var sampleOrder = new Orders({
                _id : orderId,
                total:12.5,
                orderItems :sampleOrderItems
            });

            // Create a sample Customers array that includes the new Customer
//            var sampleOrders = [sampleOrder];

            // Set GET response
//            $httpBackend.expectGET('customers/'+customerId+'/orders/'+orderId).respond(sampleOrders);
            $httpBackend.expectGET('customers/'+customerId+'/orders/'+orderId).respond(sampleOrder);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.orderItems).toEqualData(sampleOrderItems);
            expect(scope.order).toEqualData(sampleOrder);
            expect(scope.customerId).toEqualData(customerId);
            expect(scope.orderId).toEqualData(orderId);



        }));

        it('findAllItems()', inject(function(Customers, Items){

            console.log('running jasmine test for Order: $scope.findAllItems()');

            //create sample customerId
            var customerId = '999cf20451979dea2c000001';
            var sampleCustomer = {personalDetails:{forename:'fred', surname:'flintstone'}};

            //populate $stateParams
            $stateParams.customerId = customerId;

            // Create sample Customer using the Customers service
            var sampleItem = {_id:'525cf20451979dea2c000001', name:'Lamp', price:12.50};


            // Create a sample Customers array that includes the new Customer
            var sampleItems = [sampleItem];

            //Set GET Response for Customer
            $httpBackend.expectGET('customers/'+customerId).respond(sampleCustomer);

            // Set GET response
            $httpBackend.expectGET('items').respond(sampleItems);

            // Run controller functionality
            scope.findAllItems();
            $httpBackend.flush();

            // Test scope value
            expect(scope.customer).toEqualData(sampleCustomer);
            expect(scope.items).toEqualData(sampleItems);

        }));

        /*
        it('addOrderItems()', inject(function(Orders){

        }));

        it('removeOrderItems()', inject(function(Orders){

        }));

        it('createOrder()', inject(function(Orders){

        }));
        it('updateOrder()', inject(function(Orders){

        }));
        it('removeOrder()', inject(function(Orders){

        }));
*/
        /*
                it('$scope.findOne() should create an array with one Customer object fetched from XHR using a customerId URL parameter', inject(function(Customers) {
                    console.log('running jasmine test for Customer: $scope.findOne()');

                    // Define a sample Customer object
                    var sampleCustomer = new Customers({
                        name: 'New Customer'
                    });

                    // Set the URL parameter
                    $stateParams.customerId = '525a8422f6d0f87f0e407a33';

                    // Set GET response
                    $httpBackend.expectGET(/customers\/([0-9a-fA-F]{24})$/).respond(sampleCustomer);

                    // Run controller functionality
                    scope.findOne();
                    $httpBackend.flush();

                    // Test scope value
                    expect(scope.customer).toEqualData(sampleCustomer);
                }));

                it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Customers) {
                    console.log('running jasmine test for Customer: $scope.create()');

                    // Create a sample Customer object - this represents the JSON structure forming the body of the POST request we'll be constructing using the $resource service.
                    var sampleCustomerPostData = new Customers({
                        personalDetails : {
                            forename : 'firstname',
                            surname : 'lastname',
                            dob : '11/12/13'
                        },
                        addressDetails : {
                            firstLine : 'firstLine',
                            city : 'city',
                            postCode : 'postcode'
                        },
                        phoneDetails : {
                            home : '2134567',
                            office : '7654321',
                            mobile: '079323423'
                        }
                    });


                    // Create a sample Customer response - This represents the JSON structure we expect returned as a response from the POST request.
                    var sampleCustomerResponse = new Customers({
                        _id: '525cf20451979dea2c000001',
        //				name: 'New Customer'
                        personalDetails : {
                            forename : 'firstname',
                            surname : 'lastname',
                            dob : '11/12/13'
                        },
                        addressDetails : {
                            firstLine : 'firstLine',
                            city : 'city',
                            postCode : 'postcode'
                        },
                        phoneDetails : {
                            home : '2134567',
                            office : '7654321',
                            mobile: '079323423'
                        }

                    });


                    // Fixture mock form input values - here we set the values entered into a mock form. This will be used to construct the JSON structure forming the body of the POST request by the controller
                    scope.name = 'New Customer';
                    scope.forename = sampleCustomerPostData.personalDetails.forename;
                    scope.surname = sampleCustomerPostData.personalDetails.surname;
                    scope.dob = sampleCustomerPostData.personalDetails.dob;
                    scope.firstLine = sampleCustomerPostData.addressDetails.firstLine;
                    scope.city = sampleCustomerPostData.addressDetails.city;
                    scope.postCode = sampleCustomerPostData.addressDetails.postCode;
                    scope.home = sampleCustomerPostData.phoneDetails.home;
                    scope.office = sampleCustomerPostData.phoneDetails.office;
                    scope.mobile = sampleCustomerPostData.phoneDetails.mobile;


                    // Set POST response
                    $httpBackend.expectPOST('customers', sampleCustomerPostData).respond(sampleCustomerResponse);

                    console.log('@@@@@@@ jasmine failing here : ' + JSON.stringify(sampleCustomerResponse));

                    // Run controller functionality
                    scope.create();
                    $httpBackend.flush();

                    // Test form inputs are reset
                    expect(scope.forename).toEqual('');
                    expect(scope.surname).toEqual('');
                    expect(scope.dob).toEqual('');
                    expect(scope.firstLine).toEqual('');
                    expect(scope.city).toEqual('');
                    expect(scope.postCode).toEqual('');
                    expect(scope.home).toEqual('');
                    expect(scope.office).toEqual('');
                    expect(scope.mobile).toEqual('');

                    // Test URL redirection after the Customer was created
                    expect($location.path()).toBe('/customers/' + sampleCustomerResponse._id);
                }));

                it('$scope.update() should update a valid Customer', inject(function(Customers) {

                    console.log('running jasmine test for Customer: $scope.update()');

                    // Define a sample Customer put data
                    var sampleCustomerPutData = new Customers({
                        _id: '525cf20451979dea2c000001',
                        name: 'New Customer'
                    });

                    // Mock Customer in scope
                    scope.customer = sampleCustomerPutData;

                    // Set PUT response
                    $httpBackend.expectPUT(/customers\/([0-9a-fA-F]{24})$/).respond();

                    // Run controller functionality
                    scope.update();
                    $httpBackend.flush();

                    // Test URL location to new object
                    expect($location.path()).toBe('/customers/' + sampleCustomerPutData._id);
                }));

                it('$scope.remove() should send a DELETE request with a valid customerId and remove the Customer from the scope', inject(function(Customers) {

                    console.log('running jasmine test for Customer: $scope.remove()');

                    // Create new Customer object
                    var sampleCustomer = new Customers({
                        _id: '525a8422f6d0f87f0e407a33'
                    });

                    // Create new Customers array and include the Customer
                    scope.customers = [sampleCustomer];

                    // Set expected DELETE response
                    $httpBackend.expectDELETE(/customers\/([0-9a-fA-F]{24})$/).respond(204);

                    // Run controller functionality
                    scope.remove(sampleCustomer);
                    $httpBackend.flush();

                    // Test array after successful delete
                    expect(scope.customers.length).toBe(0);
                }));
        */
    });

}());

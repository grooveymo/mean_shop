Will investigate 3 approaches

i.) Retrieve Customer object, add to it's list of Order's and then save the Customer object

ii.) Create Separate $resource for Order object and then issue updates to a Customer via
     the Order $resource

iii.) Use single $resource to update Customer and Order instances.

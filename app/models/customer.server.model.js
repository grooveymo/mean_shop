'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	MyItemSchema = require('./item.server.model.js');
//
//var DummyItemSchema = new Schema({
//	name : String,
//	quantity : Number
//});

var OrderItemSchema = new Schema({

		item: {type: Schema.ObjectId, ref: 'Item'},
		quantity:  Number


	//quantity: {
		//	number: Number
		//}
	});
mongoose.model('OrderItem', OrderItemSchema);

var OrderSchema = new Schema({

		orderItems : [OrderItemSchema],
		dateSubmitted: {
			type: Date,
			default: Date.now
		},
		total : Number,
		status : {type: String,
		 		  default: 'NEW'} //NEW, IN_PROGRESS, COMPLETED
	});
mongoose.model('Order', OrderSchema);

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({

	personalDetails: {
		forename: {
			type: String,
			default: '',
			required: 'Please fill Customer forename',
			trim: true
		},
		surname: {
			type: String,
			default: '',
			required: 'Please fill Customer lastname',
			trim: true
		},
		dob: {
			type: String,
			default: '',
			required: 'Please fill Customer dob',
			trim: true
		}

	},

	addressDetails: {
		firstLine: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		},
		postCode: {
			type: String,
			required: true
		}
	},

	phoneDetails: {
		home: {
			type: String
		},
		mobile: {
			type: String
		},
		office: {
			type: String
		}
	},

	orders: [OrderSchema],

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Customer', CustomerSchema);

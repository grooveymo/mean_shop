'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	MyItemSchema = require('./item.server.model.js');

	var OrderItemSchema = new Schema({

		item: {type: Schema.ObjectId, ref: 'Item'},
		quantity: {
			number: Number
		}
	});
	mongoose.model('OrderItem', OrderItemSchema);

	var OrderSchema = new Schema({

		orderItems : [OrderItemSchema],
		dateSubmitted: Date,
		total : Number
	});
	mongoose.model('Order', OrderSchema);

//================================================
//	var TelephoneSchema = new Schema({
//		home: {
//			type: String
//		},
//		mobile: {
//			type: String
//		},
//		office: {
//			type: String
//		}
//	});
//mongoose.model('PhoneDetails', TelephoneSchema);
//
//	var AddressSchema = new Schema({
//
//		firstLine: {
//			type: String,
//			required: true
//		},
//		city: {
//			type: String,
//			required: true
//		},
//		postCode: {
//			type: String,
//			required: true
//		}
//	});
//mongoose.model('AddressDetails', AddressSchema);
//
//	var PersonalDetailsSchema = new Schema({
//
//		forename: {
//			type: String,
//			default: '',
//			required: 'Please fill Customer forename',
//			trim: true
//		},
//		surname: {
//			type: String,
//			default: '',
//			required: 'Please fill Customer lastname',
//			trim: true
//		},
//		dob: {
//			type: String,
//			default: '',
//			required: 'Please fill Customer dob',
//			trim: true
//		}
//	});
//mongoose.model('PersonalDetails', PersonalDetailsSchema);
//
//	/**
//	 * Customer Schema
//	 */
//	var CustomerSchema = new Schema({
//
//		//personalDetails: {type: Schema.Types.ObjectId, ref: PersonalDetailsSchema},
//        //
//		//addressDetails: {type: Schema.Types.ObjectId, ref: AddressSchema},
//        //
//		//phoneDetails: {type: Schema.Types.ObjectId, ref: TelephoneSchema},
//
//		personalDetails: {type: Schema.Types.ObjectId, ref: 'PersonalDetails'},
//
//		addressDetails: {type: Schema.Types.ObjectId, ref: 'AddressDetails'},
//
//		phoneDetails: {type: Schema.Types.ObjectId, ref: 'PhoneDetails'},
//
//		orders: [OrderSchema],
//
//		created: {
//			type: Date,
//			default: Date.now
//		},
//		user: {
//			type: Schema.ObjectId,
//			ref: 'User'
//		}
//	});
//
//	mongoose.model('Customer', CustomerSchema);

//==========================================================================

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({

	//personalDetails: {type: Schema.Types.ObjectId, ref: PersonalDetailsSchema},
	//
	//addressDetails: {type: Schema.Types.ObjectId, ref: AddressSchema},
	//
	//phoneDetails: {type: Schema.Types.ObjectId, ref: TelephoneSchema},

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

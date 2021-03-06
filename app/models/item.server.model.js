'use strict';

/**
 * Module dependencies.
 */
var Item = (function() {

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    /**
     * Item Schema
     */
    var ItemSchema = new Schema({
        name: {
            type: String,
            default: '',
            required: 'Please fill Item name',
            trim: true
        },
        description : {
            type: String,
            default : '',
            trim : true
        },
        price : {
            type : Number,
            required : 'Please enter price'
        },
        created: {
            type: Date,
            default: Date.now
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    });

    var _model = mongoose.model('Item', ItemSchema);

    return{
        schema : ItemSchema,
        model : _model
    };

}());

module.exports = Item;

//module.exports = function() {

//};

/**
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//module.exports = function() {

//
//Item Schema
//
var ItemSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Item name',
        trim: true
    },
    description : {
        type: String,
        default : '',
        trim : true
    },
    price : {
        type : Number,
        required : 'Please enter price'
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Item', ItemSchema);
//};
*/

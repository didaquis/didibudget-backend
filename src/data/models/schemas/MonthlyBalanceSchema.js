'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

/**
 * Monthly Balance schema
 * @constructor Monthly Balance model constructor
 */
const MonthlyBalanceSchema = new Schema({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	balance: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
	date: {
		type: Date,
		required: true
	},
	currencyISO: {
		type: String,
		required: true,
		default: 'EUR'
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	}
});

module.exports = MonthlyBalanceSchema;

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

const { CurrencyISO } = require('../../CurrencyISO');

/**
 * Monthly Balance schema
 * @constructor Monthly Balance model constructor
 */
const ExpensesSchema = new Schema({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	category: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'expensescategory',
		required: true,
	},
	subcategory: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'expensesubcategory',
		required: false,
	},
	quantity: {
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
		default: CurrencyISO.EUR
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	}
});

module.exports = ExpensesSchema;

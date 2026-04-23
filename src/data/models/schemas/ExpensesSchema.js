'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { v4 as uuidv4 } from 'uuid';

import { CurrencyISO } from '../../CurrencyISO.js';

/**
 * Expenses schema
 * @constructor Expenses model constructor
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

export default ExpensesSchema;

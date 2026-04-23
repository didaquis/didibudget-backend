'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { v4 as uuidv4 } from 'uuid';

import { CurrencyISO } from '../../CurrencyISO.js';

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
		default: CurrencyISO.EUR
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	}
});

export default MonthlyBalanceSchema;

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

const { CurrencyISO } = require('../../CurrencyISO');

/**
 * Recurring Expense Suggestion schema
 * @constructor Recurring Expense Suggestion model constructor
 */
const RecurringExpenseSuggestionSchema = new Schema({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	},
	startDay: {
		type: Number,
		required: true,
		validate: {
			validator: (value) => {
				const firstDay = 1;
				const lastDay = 31;
				return (Number.isInteger(value) && value >= firstDay && value <= lastDay);
			},
			message: 'startDay must be an integer between 1 and 31'
		}
	},
	endDay: {
		type: Number,
		required: true,
		validate: {
			validator: (value) => {
				const firstDay = 1;
				const lastDay = 31;
				return (Number.isInteger(value) && value >= firstDay && value <= lastDay);
			},
			message: 'endDay must be an integer between 1 and 31'
		}
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	},
	suggestion: {
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
		currencyISO: {
			type: String,
			required: true,
			default: CurrencyISO.EUR
		}
	},
});

module.exports = RecurringExpenseSuggestionSchema;

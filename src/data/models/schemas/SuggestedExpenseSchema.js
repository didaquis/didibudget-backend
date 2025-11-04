'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Suggested Expense schema
 * @constructor Suggested Expense model constructor
 */
const SuggestedExpenseSchema = new Schema({
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'expensescategory',
		required: true,
	},
	subcategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'expensesubcategory',
	},
	quantity: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
});

module.exports = SuggestedExpenseSchema;

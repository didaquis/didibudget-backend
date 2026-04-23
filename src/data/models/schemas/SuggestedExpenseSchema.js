'use strict';

import mongoose from 'mongoose';
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

export default SuggestedExpenseSchema;

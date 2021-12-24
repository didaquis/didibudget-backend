'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

/**
 * Expense category schema
 * @constructor Expense category model constructor
 */
const ExpenseCategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	subcategories: [{ type: Schema.Types.ObjectId, ref: 'expensesubcategory' }],
	inmutableKey: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	}
});

module.exports = ExpenseCategorySchema;

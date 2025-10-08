'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

/**
 * Expense subcategory schema
 * @constructor Expense subcategory model constructor
 */
const ExpenseSubcategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	inmutableKey: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	emojis: {
		type: [mongoose.SchemaTypes.String],
		required: true,
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	},
});

module.exports = ExpenseSubcategorySchema;

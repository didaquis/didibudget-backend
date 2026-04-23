'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { v4 as uuidv4 } from 'uuid';

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

export default ExpenseSubcategorySchema;

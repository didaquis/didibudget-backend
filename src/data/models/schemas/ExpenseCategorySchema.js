'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { v4 as uuidv4 } from 'uuid';

import { CategoryType } from '../../CategoryType.js';

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
	categoryType: {
		type: String,
		enum: Object.values(CategoryType),
		required: true,
	},
});

export default ExpenseCategorySchema;

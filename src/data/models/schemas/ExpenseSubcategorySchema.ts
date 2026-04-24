import mongoose, { Schema, Document } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

/**
 * Expense subcategory schema
 */
export interface IExpenseSubcategory extends Document {
	name: string;
	inmutableKey: string;
	emojis: string[];
	uuid: string;
}

const ExpenseSubcategorySchema: Schema<IExpenseSubcategory> = new Schema({
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

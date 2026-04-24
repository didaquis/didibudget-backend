import mongoose, { Schema, Types } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

/**
 * Expense subcategory schema
 */
export interface IExpenseSubcategory {
	_id: Types.ObjectId;
	name: string;
	inmutableKey: string;
	emojis: string[];
	uuid: string;
}

const ExpenseSubcategorySchema = new Schema<IExpenseSubcategory>({
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

import mongoose, { Schema, Document, Types } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

import { CurrencyISO } from '#/data/CurrencyISO.js';

/**
 * Expenses schema
 */
export interface IExpense extends Document {
	user_id: Types.ObjectId;
	category: Types.ObjectId;
	subcategory?: Types.ObjectId;
	quantity: Types.Decimal128;
	date: Date;
	currencyISO: string;
	uuid: string;
}

const ExpensesSchema: Schema<IExpense> = new Schema({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
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

export default ExpensesSchema;

import mongoose, { Schema, Document, Types } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

import { CurrencyISO } from '../../CurrencyISO.js';

/**
 * Monthly Balance schema
 */
export interface IMonthlyBalance extends Document {
	user_id: Types.ObjectId;
	balance: Types.Decimal128;
	date: Date;
	currencyISO: string;
	uuid: string;
}

const MonthlyBalanceSchema: Schema<IMonthlyBalance> = new Schema({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	balance: {
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

export default MonthlyBalanceSchema;

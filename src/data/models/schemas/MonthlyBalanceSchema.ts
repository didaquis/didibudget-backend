import mongoose, { Schema, Types } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

import { CurrencyISO } from '#/data/CurrencyISO.js';
import { MAX_YEAR, MIN_YEAR } from '#/helpers/monthlyBalanceMonth.js';

/**
 * Monthly Balance schema
 */
export interface IMonthlyBalance {
	_id: Types.ObjectId;
	user_id: Types.ObjectId;
	balance: Types.Decimal128;
	year: number;
	month: number;
	currencyISO: string;
	uuid: string;
}

const MonthlyBalanceSchema = new Schema<IMonthlyBalance>({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	balance: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
	year: {
		type: Number,
		required: true,
		min: MIN_YEAR,
		max: MAX_YEAR
	},
	month: {
		type: Number,
		required: true,
		min: 1,
		max: 12
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

MonthlyBalanceSchema.index({ user_id: 1, year: 1, month: 1 }, { unique: true });

export default MonthlyBalanceSchema;

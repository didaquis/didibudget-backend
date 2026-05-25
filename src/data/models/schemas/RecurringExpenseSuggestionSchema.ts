import mongoose, { Schema, Types } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

import SuggestedExpenseSchema from './SuggestedExpenseSchema.js';
import type { ISuggestedExpense } from './SuggestedExpenseSchema.js';

/**
 * Recurring Expense Suggestion schema
 */
export interface IRecurringExpenseSuggestion {
	_id: Types.ObjectId;
	user_id: Types.ObjectId;
	isActive: boolean;
	startDay: number;
	endDay: number;
	uuid: string;
	suggestedExpense: ISuggestedExpense;
}

const RecurringExpenseSuggestionSchema = new Schema<IRecurringExpenseSuggestion>({
	user_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: true
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	},
	startDay: {
		type: Number,
		required: true,
		validate: {
			validator: (value) => {
				const firstDay = 1;
				const lastDay = 31;
				return (Number.isInteger(value) && value >= firstDay && value <= lastDay);
			},
			message: 'startDay must be an integer between 1 and 31'
		}
	},
	endDay: {
		type: Number,
		required: true,
		validate: {
			validator: (value) => {
				const firstDay = 1;
				const lastDay = 31;
				return (Number.isInteger(value) && value >= firstDay && value <= lastDay);
			},
			message: 'endDay must be an integer between 1 and 31'
		}
	},
	uuid: {
		type: String,
		required: true,
		unique: true,
		default: uuidv4
	},
	suggestedExpense: { type: SuggestedExpenseSchema, required: true },
});

RecurringExpenseSuggestionSchema.index({ user_id: 1, isActive: 1 });

export default RecurringExpenseSuggestionSchema;

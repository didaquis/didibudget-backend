import mongoose, { Schema, Types } from 'mongoose';

/**
 * Suggested Expense schema
 */
export interface ISuggestedExpense {
	_id: Types.ObjectId;
	category: Types.ObjectId;
	subcategory?: Types.ObjectId;
	quantity: Types.Decimal128;
}

const SuggestedExpenseSchema = new Schema<ISuggestedExpense>({
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'expensescategory',
		required: true,
	},
	subcategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'expensesubcategory',
	},
	quantity: {
		type: mongoose.Schema.Types.Decimal128,
		required: true,
	},
});

export default SuggestedExpenseSchema;

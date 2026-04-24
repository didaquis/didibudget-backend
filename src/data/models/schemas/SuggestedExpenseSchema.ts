import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Suggested Expense schema
 */
export interface ISuggestedExpense extends Document {
	category: Types.ObjectId;
	subcategory?: Types.ObjectId;
	quantity: Types.Decimal128;
}

const SuggestedExpenseSchema: Schema<ISuggestedExpense> = new Schema({
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

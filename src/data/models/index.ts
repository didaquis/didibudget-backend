import mongoose from 'mongoose';

import {
	UsersSchema,
	MonthlyBalanceSchema,
	ExpenseCategorySchema,
	ExpenseSubcategorySchema,
	ExpensesSchema,
	RecurringExpenseSuggestionSchema
} from './schemas/index.js';

import type { IUser } from './schemas/UsersSchema.js';
import type { IMonthlyBalance } from './schemas/MonthlyBalanceSchema.js';
import type { IExpenseCategory } from './schemas/ExpenseCategorySchema.js';
import type { IExpenseSubcategory } from './schemas/ExpenseSubcategorySchema.js';
import type { IExpense } from './schemas/ExpensesSchema.js';
import type { IRecurringExpenseSuggestion } from './schemas/RecurringExpenseSuggestionSchema.js';

export type { IUser, IMonthlyBalance, IExpenseCategory, IExpenseSubcategory, IExpense, IRecurringExpenseSuggestion };

export const Users = mongoose.model<IUser>('users', UsersSchema);
export const MonthlyBalance = mongoose.model<IMonthlyBalance>('monthlybalance', MonthlyBalanceSchema);
export const ExpenseCategory = mongoose.model<IExpenseCategory>('expensecategory', ExpenseCategorySchema);
export const ExpenseSubcategory = mongoose.model<IExpenseSubcategory>('expensesubcategory', ExpenseSubcategorySchema);
export const Expenses = mongoose.model<IExpense>('expenses', ExpensesSchema);
export const RecurringExpenseSuggestion = mongoose.model<IRecurringExpenseSuggestion>('recurringexpensesuggestion', RecurringExpenseSuggestionSchema);

export interface ModelsMap {
	Users: mongoose.Model<IUser>;
	MonthlyBalance: mongoose.Model<IMonthlyBalance>;
	ExpenseCategory: mongoose.Model<IExpenseCategory>;
	ExpenseSubcategory: mongoose.Model<IExpenseSubcategory>;
	Expenses: mongoose.Model<IExpense>;
	RecurringExpenseSuggestion: mongoose.Model<IRecurringExpenseSuggestion>;
}

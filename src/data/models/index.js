'use strict';

import mongoose from 'mongoose';

import { UsersSchema, MonthlyBalanceSchema, ExpenseCategorySchema, ExpenseSubcategorySchema, ExpensesSchema, RecurringExpenseSuggestionSchema } from './schemas/index.js';

export const Users = mongoose.model('users', UsersSchema);
export const MonthlyBalance = mongoose.model('monthlybalance', MonthlyBalanceSchema);
export const ExpenseCategory = mongoose.model('expensecategory', ExpenseCategorySchema);
export const ExpenseSubcategory = mongoose.model('expensesubcategory', ExpenseSubcategorySchema);
export const Expenses = mongoose.model('expenses', ExpensesSchema);
export const RecurringExpenseSuggestion = mongoose.model('recurringexpensesuggestion', RecurringExpenseSuggestionSchema);

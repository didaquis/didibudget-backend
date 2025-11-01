'use strict';

const mongoose = require('mongoose');

const { UsersSchema, MonthlyBalanceSchema, ExpenseCategorySchema, ExpenseSubcategorySchema, ExpensesSchema, RecurringExpenseSuggestionSchema } = require('./schemas');

module.exports = {
	Users: mongoose.model('users', UsersSchema),
	MonthlyBalance: mongoose.model('monthlybalance', MonthlyBalanceSchema),
	ExpenseCategory: mongoose.model('expensecategory', ExpenseCategorySchema),
	ExpenseSubcategory: mongoose.model('expensesubcategory', ExpenseSubcategorySchema),
	Expenses: mongoose.model('expenses', ExpensesSchema),
	RecurringExpenseSuggestion: mongoose.model('recurringexpensesuggestion', RecurringExpenseSuggestionSchema),
};
'use strict';

const mongoose = require('mongoose');

const { UsersSchema, MonthlyBalanceSchema, ExpenseCategorySchema, ExpenseSubcategorySchema } = require('./schemas');

module.exports = {
	Users: mongoose.model('users', UsersSchema),
	MonthlyBalance: mongoose.model('monthlybalance', MonthlyBalanceSchema),
	ExpenseCategory: mongoose.model('expensecategory', ExpenseCategorySchema),
	ExpenseSubcategory: mongoose.model('expensesubcategory', ExpenseSubcategorySchema),
};
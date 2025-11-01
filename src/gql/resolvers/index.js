'use strict';

const merge = require('lodash.merge');

const users = require('./users');
const monthlyBalance = require('./monthlyBalance');
const auth = require('./auth');
const expenseCategory = require('./expenseCategory');
const expenses = require('./expenses');
const recurringExpenseSuggestion = require('./recurringExpenseSuggestion');

module.exports = merge(
	users,
	monthlyBalance,
	auth,
	expenseCategory,
	expenses,
	recurringExpenseSuggestion,
);

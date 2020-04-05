'use strict';

const { merge } = require('lodash');

const users = require('./users');
const monthlyBalance = require('./monthlyBalance');
const auth = require('./auth');
const expenseCategory = require('./expenseCategory');
const expenses = require('./expenses');

module.exports = merge(
	users,
	monthlyBalance,
	auth,
	expenseCategory,
	expenses,
);

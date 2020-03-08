'use strict';

const { merge } = require('lodash');

const users = require('./users');
const monthlyBalance = require('./monthlyBalance');
const auth = require('./auth');
const expenseCategory = require('./expenseCategory');

module.exports = merge(
	users,
	monthlyBalance,
	auth,
	expenseCategory,
);

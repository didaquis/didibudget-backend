'use strict';

const { merge } = require('lodash');

const users = require('./users');
const monthlyBalance = require('./monthlyBalance');
const auth = require('./auth');

module.exports = merge(
	users,
	monthlyBalance,
	auth
);

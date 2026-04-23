'use strict';

import merge from 'lodash.merge';

import * as users from './users.js';
import * as monthlyBalance from './monthlyBalance.js';
import * as auth from './auth.js';
import * as expenseCategory from './expenseCategory.js';
import * as expenses from './expenses.js';
import * as recurringExpenseSuggestion from './recurringExpenseSuggestion.js';

export default merge(
	{},
	users,
	monthlyBalance,
	auth,
	expenseCategory,
	expenses,
	recurringExpenseSuggestion,
);

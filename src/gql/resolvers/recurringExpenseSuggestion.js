'use strict';

const { recurringExpenseSuggestionDTO } = require('../../dto/recurringExpenseSuggestionDTO');

/**
* All resolvers related to Recurring Expense Suggestion
* @typedef {Object}
*/
module.exports = {
	Query: {
		/**
		* Get all recurring expense suggestions for an user
		*/
		getRecurringExpenseSuggestion: async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			const allSuggestions = await context.di.model.RecurringExpenseSuggestion.find({ user_id: user._id }).lean();

			return allSuggestions.map(suggestion => recurringExpenseSuggestionDTO(suggestion));
		},
		/**
		* Get the active recurring expense suggestions for an user for a specific day of the month
		*/
		getRecurringExpenseSuggestionByDay: async (parent, { day }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);
			const minDay = 1;
			const maxDay = 31;
			context.di.parameterValidations.isIntegerBetween(day, minDay, maxDay);

			const user = await context.di.authValidation.getUser(context);

			const allSuggestions = await context.di.model.RecurringExpenseSuggestion.find({
				user_id: user._id,
				isActive: true,
				$expr: {
					$or: [
						{
							$and: [
								{ $lte: [ '$startDay', day ] },
								{ $gte: [ '$endDay', day ] }
							]
						},
						{
							$and: [
								{ $gt: [ '$startDay', '$endDay' ] },
								{
									$or: [
										{ $gte: [ day, '$startDay' ] },
										{ $lte: [ day, '$endDay' ] }
									]
								}
							]
						}
					]
				}
			}).lean();

			return allSuggestions.map(suggestion => recurringExpenseSuggestionDTO(suggestion));
		},
	},
	Mutation: {
		/**
		* Register a recurring expense suggestion
		*/
		registerRecurringExpenseSuggestion: async (parent, { isActive, startDay, endDay, suggestedExpense }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.RecurringExpenseSuggestion({
				user_id: user._id,
				isActive: isActive,
				startDay: startDay,
				endDay: endDay,
				suggestedExpense: {
					category: suggestedExpense.category,
					subcategory: suggestedExpense.subcategory,
					quantity: suggestedExpense.quantity
				}
			}).save().then(recurringExpenseSuggestion => recurringExpenseSuggestionDTO(recurringExpenseSuggestion));
		},
	}
};
